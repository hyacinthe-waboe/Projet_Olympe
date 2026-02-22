import React, { createContext, useState, useContext, useEffect } from 'react';

const CallContext = createContext();


export const CallProvider = ({ children }) => {
    const [isRinging, setIsRinging] = useState(false);
    const [incomingCaller, setIncomingCaller] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const [callLogs, setCallLogs] = useState([]);
    

    // 🟢 1. ON CHARGE L'HISTORIQUE DEPUIS SYMFONY
    const fetchHistory = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/calls', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                const formattedLogs = data.map(call => ({
                    logId: call.id,
                    name: call.contactName || "Inconnu",
                    number: call.phoneNumber,
                    status: call.status,
                    note: call.note,
                    time: new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    // 🟢 ON RESTAURE L'IDENTITÉ COMPLÈTE DU PATIENT ICI
                    id: call.appelant ? call.appelant.id : null,
                    email: call.appelant ? call.appelant.email : 'Non renseigné',
                    birthDate: call.appelant?.birthDate ? call.appelant.birthDate.split('T')[0] : 'Non renseignée',
                    isKnown: !!call.appelant
                }));
                setCallLogs(formattedLogs);
            }
        } catch (err) { console.error("Erreur historique", err); }
    };

    const simulateCall = async () => {
        if (isRinging || activeCall) return;
        try {
            const res = await fetch('http://127.0.0.1:8000/api/appelants', { credentials: 'include' });
            const data = await res.json();
            const appelants = data["hydra:member"] || (Array.isArray(data) ? data : []);
            
            let callerInfo;
            if (appelants.length > 0) {
                const randomPatient = appelants[Math.floor(Math.random() * appelants.length)];
                callerInfo = {
                    id: randomPatient.id,
                    name: `${randomPatient.firstname || ''} ${randomPatient.lastname || ''}`.trim(),
                    number: randomPatient.phone,
                    email: randomPatient.email || 'Non renseigné',
                    birthDate: randomPatient.birthDate ? randomPatient.birthDate.split('T')[0] : 'Non renseignée',
                    isKnown: true
                };
            } else {
                callerInfo = { id: null, name: "Inconnu", number: "06 12 34 56 78", isKnown: false };
            }
            setIncomingCaller(callerInfo);
            setIsRinging(true);
        } catch (err) { console.error(err); }
    };

    const answerCall = () => {
        setIsRinging(false);
        setActiveCall({ ...incomingCaller, direction: 'incoming' }); // 👈 On note "entrant"
        setIncomingCaller(null);
    };

    const endCall = () => {
        setIsRinging(false);
        setIncomingCaller(null);
        setActiveCall(null);
    };

    const startOutgoingCall = async (number) => {
        if (isRinging || activeCall || !number.trim()) return null;
        
        let callerInfo = {
            id: null, name: "Appel sortant", number: number, email: "Non renseigné",
            birthDate: "Non renseignée", isKnown: false, direction: 'outgoing' // 👈 On note "sortant"
        };

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/appelants/search?phone=${encodeURIComponent(number)}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.id) {
                    callerInfo = {
                        id: data.id, name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
                        number: data.phone, email: data.email || 'Non renseigné',
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : 'Non renseignée',
                        isKnown: true, direction: 'outgoing'
                    };
                }
            }
        } catch (err) { console.error(err); }
        
        setActiveCall(callerInfo);
        return callerInfo;
    };

    // 🟢 2. LA POUBELLE SUPPRIME DANS LA BASE DE DONNÉES
    const deleteLog = async (logIdToRemove) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/calls/${logIdToRemove}`, {
                method: 'DELETE', credentials: 'include'
            });
            fetchHistory(); // Rafraîchit après suppression
        } catch (err) { console.error(err); }
    };

    return (
        <CallContext.Provider value={{ 
            isRinging, incomingCaller, activeCall, callLogs, setCallLogs, 
            simulateCall, answerCall, endCall, deleteLog, startOutgoingCall,
            fetchHistory // 🟢 Important pour la suite
        }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
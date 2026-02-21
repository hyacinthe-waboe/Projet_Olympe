import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPhone, FaCalendarAlt, FaCommentDots, FaArrowLeft, FaEnvelope, FaClock, FaHistory, FaBirthdayCake, FaStethoscope, FaPaperPlane } from 'react-icons/fa';

const PatientDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Nouveaux states pour le module de message
    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Fonction pour recharger l'historique (utile après l'envoi d'un message)
    const fetchHistory = () => {
        fetch(`http://127.0.0.1:8000/api/patients/${id}/history`, { credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                setData(json);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchHistory();
    }, [id]);

    // Fonction d'envoi du message
    const handleSendMessage = async () => {
        if (!messageContent.trim()) return;
        setIsSending(true);

        try {
            // ⚠️ Ajuste l'URL /api/messages selon la route exacte de ton API Symfony pour créer un message
            const response = await fetch('http://127.0.0.1:8000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: messageContent,
                    appelantId: parseInt(id),
                    // Si ton API a besoin d'autres champs, tu peux les ajouter ici
                }),
                credentials: 'include'
            });

            if (response.ok) {
                setMessageContent(''); // On vide la zone de texte
                fetchHistory(); // On recharge l'historique pour voir le nouveau message apparaître !
            } else {
                alert("Erreur serveur lors de l'envoi du message. (Vérifie la route API)");
            }
        } catch (error) {
            console.error("Erreur d'envoi:", error);
            alert("Erreur de connexion.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 text-sm">Chargement du dossier...</div>;
    if (!data || data.error) return <div className="p-10 text-center text-red-500 font-medium">Dossier introuvable.</div>;

    const timeline = [
        ...data.appointments.map(a => ({ ...a, type: 'appointment' })),
        ...data.messages.map(m => ({ ...m, type: 'message' }))
    ].sort((a, b) => {
        const dateA = new Date(a.date.split(' ')[0].split('/').reverse().join('-'));
        const dateB = new Date(b.date.split(' ')[0].split('/').reverse().join('-'));
        return dateB - dateA;
    });

    return (
        <div className="flex flex-1 p-4 gap-4 h-full bg-gray-100 overflow-hidden text-gray-800">
            
            {/* --- COLONNE 1 : PROFIL --- */}
            <div className="w-80 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition"
                    >
                        <FaArrowLeft className="mr-2" /> Retour
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                            {data.info.firstname.charAt(0)}{data.info.lastname.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                {data.info.firstname} {data.info.lastname}
                            </h3>
                            <p className="text-sm text-blue-600">Patient #PAT-{id}</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                                    <FaBirthdayCake className="text-gray-400" /> Date de naissance
                                </p>
                                <p className="text-sm text-gray-900 ml-5 font-medium">{data.info.birthDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                                    <FaPhone className="text-gray-400" /> Téléphone
                                </p>
                                <p className="text-sm text-gray-900 ml-5 font-medium">{data.info.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                                    <FaEnvelope className="text-gray-400" /> Email
                                </p>
                                <p className="text-sm text-gray-900 ml-5 font-medium truncate">{data.info.email || "Non renseigné"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                                    <FaStethoscope className="text-gray-400" /> Médecin traitant
                                </p>
                                <p className="text-sm text-blue-700 ml-5 font-medium">{data.info.doctors}</p>
                            </div>
                        </div>

                        {/* 🟢 MODIF : Bouton unique et fonctionnel pour le RDV */}
                        <div className="pt-6 border-t border-gray-100">
                             <button 
                                onClick={() => navigate('/calendar')}
                                className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                             >
                                <FaCalendarAlt className="text-gray-400"/> Prendre un RDV
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- COLONNE 2 : HISTORIQUE --- */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800">Historique complet</h2>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> RDV
                        </span>
                        <span className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /> Messages
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="divide-y divide-gray-100">
                        {timeline.map((item, index) => (
                            <div key={index} className="p-5 hover:bg-gray-50/50 transition flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white
                                    ${item.type === 'appointment' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                    {item.type === 'appointment' ? <FaCalendarAlt size={14}/> : <FaCommentDots size={14}/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-gray-900 truncate">
                                            {item.type === 'appointment' ? `Consultation avec Dr. ${item.doctor}` : `Message pour Dr. ${item.doctor}`}
                                        </h4>
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5 flex-shrink-0 ml-2">
                                            <FaClock className="text-gray-400" /> {item.date} {item.time && `• ${item.time}`}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {item.content || "Interaction médicale enregistrée."}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {timeline.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <FaHistory className="text-gray-300 mb-3" size={24} />
                                <p className="text-gray-500 text-sm">Aucune donnée historique trouvée pour ce patient.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- COLONNE 3 : NOUVEAU MODULE MESSAGE EXPRESS --- */}
            <div className="w-80 bg-white border border-gray-200 rounded-lg flex flex-col p-5 shadow-sm overflow-hidden">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 flex-shrink-0">
                    <FaPaperPlane className="text-blue-500"/> Message Rapide
                </h3>
                
                <textarea 
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-1 w-full bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none mb-4 transition-colors min-h-[150px]"
                    placeholder="Rédigez un message pour le médecin concernant ce patient..."
                />
                
                <button 
                    onClick={handleSendMessage}
                    disabled={isSending || !messageContent.trim()}
                    className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition flex justify-center items-center gap-2 flex-shrink-0 ${
                        isSending || !messageContent.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {isSending ? "Envoi..." : "Envoyer le message"}
                </button>
            </div>
        </div>
    );
};

export default PatientDetailsPage;
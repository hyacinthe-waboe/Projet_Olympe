// src/pages/TelephonePage.jsx

import React, { useState } from "react";
import {
  FaPhone,
  FaPhoneSlash,
  FaUser,
  FaEnvelope,
  FaHistory,
  FaCalendarAlt,
  FaCommentDots,
  FaTimes,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown

} from "react-icons/fa";
import { useCall } from "../context/CallContext.jsx";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config/api'; // <--- AJOUT DE L'IMPORT ICI

export default function TelephonePage() {
  const navigate = useNavigate();
  // 🟢 ON RÉCUPÈRE LES FONCTIONS ET ÉTATS GLOBAUX
  const {
    isRinging,
    incomingCaller,
    activeCall,
    simulateCall,
    answerCall,
    endCall,
    callLogs,
    setCallLogs,
    deleteLog,
    startOutgoingCall,
    fetchHistory,
  } = useCall();

  const [activeTab, setActiveTab] = useState("Tous");
  const [dialedNumber, setDialedNumber] = useState("");

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [callNote, setCallNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [selectedHistoricalCall, setSelectedHistoricalCall] = useState(null);
  const [currentCallLogId, setCurrentCallLogId] = useState(null);

  React.useEffect(() => {
    setCallLogs([]); // 🟢 Ajoute cette ligne : On vide la liste INSTANTANÉMENT
    fetchHistory();  // Puis on télécharge la nouvelle liste
  }, []);

  // --- ACTIONS QUI METTENT À JOUR L'HISTORIQUE ET LE CERVEAU ---
  const handleAnswer = () => {
    const logId = Date.now(); // On crée l'ID ici
    const newLog = {
      ...incomingCaller,
      status: "incoming",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      logId: logId,
      note: "", // On prévoit la place pour la note
    };
    setCallLogs((prev) => [newLog, ...prev]);
    setCurrentCallLogId(logId); // 🟢 On s'en souvient
    answerCall();
    setSelectedHistoricalCall(null);
  };

  const handleDecline = async () => {
    // 🟢 Enregistre en base de données comme "manqué"
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      await fetch(`${API_URL}/api/calls`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: incomingCaller.number,
          contactName: incomingCaller.isKnown ? incomingCaller.name : "Inconnu",
          status: "missed",
          appelantId: incomingCaller.id
        }),
        credentials: "include"
      });
      fetchHistory(); // Rafraîchit la colonne de gauche
    } catch (err) { console.error(err); }
    endCall();
  };

  // --- FONCTION D'ENVOI MESSAGE RAPIDE ---
  const handleSendMessage = async () => {
    if (!messageContent.trim() || !activeCall) return;

    setIsSending(true);
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageContent,
          appelantId: activeCall.id,
        }),
        credentials: "include",
      });

      // 🟢 LA SÉCURITÉ ICI : Si le serveur a planté, on déclenche une vraie erreur !
      if (!response.ok) {
        throw new Error(
          `Le serveur a répondu avec une erreur ${response.status}`,
        );
      }

      setIsMessageModalOpen(false);
      setMessageContent("");
      alert("✅ Consigne envoyée au médecin !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'envoi. Vérifiez la console.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEndCallWithNote = async () => {
    if (!activeCall) return;

    // 🟢 1. ON SAUVEGARDE L'APPEL DANS SYMFONY (Pour la liste privée)
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      await fetch(`${API_URL}/api/calls`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: activeCall.number,
          contactName: activeCall.isKnown ? activeCall.name : "Appel sortant",
          status: activeCall.direction === "outgoing" ? "outgoing" : "completed",
          note: callNote,
          appelantId: activeCall.id
        }),
        credentials: "include"
      });
    } catch (err) { console.error("Erreur sauvegarde appel", err); }

    // 2. CREATION DE LA TÂCHE (Pour les consignes du médecin)
    if (callNote.trim()) {
      setIsSavingNote(true);
      const contactInfo = activeCall.isKnown ? activeCall.name : activeCall.number;
      try {
        // 👇 REMPLACEMENT PAR ${API_URL} 👇
        await fetch(`${API_URL}/api/tasks`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: `📞 Note - ${contactInfo} : ${callNote}`, isDone: false }),
          credentials: "include",
        });
      } catch (err) { console.error(err); }
    }

    // 3. FIN D'APPEL ET RAFRAÎCHISSEMENT
    await fetchHistory();
    setCallNote("");
    setCurrentCallLogId(null);
    setIsSavingNote(false);
    endCall();
  };

  // 🟢 LOGIQUE DU CLAVIER
  const handleKeypadPress = (digit) => {
    if (activeCall || isRinging) return; // On bloque le clavier si on est déjà en ligne
    if (dialedNumber.length < 14) setDialedNumber((prev) => prev + digit);
  };

  const handleDialCall = async () => {
    if (!dialedNumber) return;
    await startOutgoingCall(dialedNumber);
    setDialedNumber("");
    setSelectedHistoricalCall(null);
  };

  // --- SOUS-COMPOSANT : ALERTE APPEL ENTRANT ---
  const IncomingCallBanner = () => {
    if (!isRinging || !incomingCaller) return null;

    return (
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white rounded-2xl shadow-2xl p-6 flex flex-col items-center w-96 animate-pulse ring-4 ring-green-500 ring-opacity-50">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <FaPhone className="text-green-400 text-2xl" />
        </div>
        <h3 className="text-xl font-bold">{incomingCaller.name}</h3>
        <p className="text-gray-400 text-lg mb-6">{incomingCaller.number}</p>

        <div className="flex gap-4 w-full">
          <button
            onClick={handleDecline}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition"
          >
            <FaPhoneSlash /> Refuser
          </button>
          <button
            onClick={handleAnswer}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition"
          >
            <FaPhone /> Décrocher
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden relative bg-gray-100">
      {/* LA MODALE QUI SONNE */}
      <IncomingCallBanner />

      {/* --- COLONNE 1 : LISTE DES APPELS --- */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <button
            onClick={simulateCall} // 🟢 Appel de la fonction globale
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition flex justify-center items-center gap-2 ${isRinging || activeCall ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={isRinging || activeCall}
          >
            <FaPhone /> Simuler un appel
          </button>
        </div>
        <div className="p-3 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("Tous")}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium ${activeTab === "Tous" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab("Manqués")}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium ${activeTab === "Manqués" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            >
              Manqués
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {callLogs
            .filter((call) => activeTab === "Tous" || call.status === "missed")
            .map((call) => (
              // 🟢 AJOUT DE 'group relative' pour gérer l'apparition au survol
              <div
                key={call.logId}
                onClick={() => !activeCall && setSelectedHistoricalCall(call)}
                className={`group relative flex items-center p-4 border-b border-gray-50 cursor-pointer transition ${selectedHistoricalCall?.logId === call.logId
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                  } ${activeCall ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* 🟢 COULEUR DE L'AVATAR (Vert = Entrant, Bleu = Sortant, Rouge = Manqué) */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 
                  ${call.status === "missed" ? "bg-red-500" :
                    call.status === "outgoing" ? "bg-blue-500" :
                      "bg-emerald-500"}`}>
                  {call.name && call.name !== "Appel sortant" ? call.name.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="ml-3 flex-1 min-w-0 pr-6">
                  <p className={`font-semibold truncate ${call.status === "missed" ? "text-red-600" : "text-gray-900"}`}>
                    {call.name}
                  </p>

                  {/* 🟢 ICÔNE ET NUMÉRO SOUS LE NOM */}
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    {call.status === "outgoing" ? <FaArrowUp className="text-blue-500" size={10} /> :
                      call.status === "missed" ? <FaTimes className="text-red-500" size={10} /> :
                        <FaArrowDown className="text-emerald-500" size={10} />}
                    {call.number}
                  </p>
                </div>
                <div className="text-xs text-gray-400">{call.time}</div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLog(call.logId);
                    if (selectedHistoricalCall?.logId === call.logId) {
                      setSelectedHistoricalCall(null);
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white hover:bg-red-50 rounded-full shadow-sm"
                  title="Supprimer de l'historique"
                >
                  <FaTrashAlt size={12} />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* --- COLONNE 2 : DÉTAILS DU PATIENT (Design Original - Affichage Dynamique) --- */}
      <div className="flex-1 bg-white overflow-y-auto">
        {/* 🟢 LOGIQUE : On choisit d'afficher soit l'appel actif, soit l'appel cliqué dans l'historique */}
        {(() => {
          const dataToShow = activeCall || selectedHistoricalCall;

          if (!dataToShow) {
            return (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <FaPhone className="text-6xl mb-4 text-gray-300" />
                <p className="text-lg font-medium">En attente d'appel...</p>
                <p className="text-sm">
                  Cliquez sur un appel dans l'historique ou simulez un appel.
                </p>
              </div>
            );
          }

          return (
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeCall
                    ? "Fiche appelant (En direct)"
                    : "Détails de l'appel passé"}
                </h2>
              </div>

              <div className="flex items-center space-x-5 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                  {dataToShow.name
                    ? dataToShow.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {dataToShow.name}
                    </h3>
                    {activeCall ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse">
                        En ligne
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${dataToShow.status === "missed" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {dataToShow.status === "missed"
                          ? "Appel Manqué"
                          : "Appel Terminé"}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-lg mt-1">
                    {dataToShow.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    Né(e) le {dataToShow.birthDate || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-10">
                <p className="text-gray-700 flex items-center text-base">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <span>{dataToShow.email || "Non renseigné"}</span>
                </p>
                <p className="text-gray-700 flex items-center text-base">
                  <FaUser className="text-gray-400 mr-3" />
                  <span>
                    {dataToShow.isKnown ? "Patient Connu" : "Nouveau Numéro"}
                  </span>
                </p>
              </div>
              {/* 🟢 AFFICHAGE DE LA NOTE ENREGISTRÉE (Si c'est un appel passé) */}
              {!activeCall && dataToShow.note && (
                <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <h4 className="text-xs font-bold text-yellow-700 uppercase mb-2">
                    Note de l'appel :
                  </h4>
                  <p className="text-gray-800 italic">"{dataToShow.note}"</p>
                </div>
              )}
              {dataToShow.isKnown && (
                <>
                  <h4 className="font-semibold text-lg mb-4 text-gray-800">
                    Actions rapides
                  </h4>
                  <div className="flex gap-4 border-t border-gray-100 pt-6">
                    <button
                      onClick={() => navigate("/calendar")}
                      className="px-6 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                    >
                      <FaCalendarAlt /> Prendre RDV
                    </button>

                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className="px-6 py-2.5 bg-purple-50 text-purple-700 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-purple-100 transition"
                    >
                      <FaCommentDots /> Message rapide
                    </button>

                    <button
                      onClick={() =>
                        window.open(`/patient/${dataToShow.id}`, "_blank")
                      }
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-gray-200 transition"
                    >
                      <FaHistory /> Historique 360°
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* --- COLONNE 3 : CLAVIER & NOTES --- */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col p-5 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Prise de note</h3>
          {/* 🟢 LA CORBEILLE : Apparaît seulement s'il y a du texte et un appel actif */}
          {callNote && activeCall && (
            <button
              onClick={() => setCallNote("")}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Effacer la note"
            >
              <FaTrashAlt size={16} />
            </button>
          )}
        </div>
        <textarea
          className="w-full h-40 bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-6"
          placeholder="Écrivez les informations de l'appel ici..."
          disabled={!activeCall}
          value={callNote}
          onChange={(e) => setCallNote(e.target.value)}
        />

        {/* --- ÉCRAN DU CLAVIER --- */}
        <div className="mb-6 mt-4">
          <div className="w-full h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-between px-4 mb-2 shadow-sm">
            <span className="text-xl font-semibold tracking-widest text-gray-800">
              {dialedNumber || "..."}
            </span>
            {dialedNumber && (
              <button
                onClick={() => setDialedNumber((prev) => prev.slice(0, -1))}
                className="text-gray-400 hover:text-red-500 font-bold text-xl"
              >
                ⌫
              </button>
            )}
          </div>
        </div>

        {/* --- TOUCHES DU CLAVIER --- */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeypadPress(key)}
              disabled={!!activeCall || isRinging}
              className={`py-3 rounded-xl font-bold text-lg transition shadow-sm border border-gray-100 
                ${activeCall || isRinging
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 active:bg-blue-100"}`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* --- BOUTON APPELER / RACCROCHER --- */}
        {!activeCall ? (
          <button
            onClick={handleDialCall}
            disabled={!dialedNumber}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-sm ${dialedNumber
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-100 text-green-400 cursor-not-allowed"
              }`}
          >
            <FaPhone /> Appeler
          </button>
        ) : (
          <button
            onClick={handleEndCallWithNote}
            disabled={isSavingNote}
            className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition border bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          >
            <FaPhoneSlash /> {isSavingNote ? "Enregistrement..." : "Raccrocher l'appel"}
          </button>
        )}
      </div>

      {/* 🟢 MODALE MESSAGE RAPIDE EN SURIMPRESSION */}
      {isMessageModalOpen && activeCall && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaCommentDots /> Message au médecin
              </h3>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              {/* 🟢 NOUVEL AFFICHAGE DU DESTINATAIRE */}
              <div className="flex items-center gap-2 mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                <span className="text-sm text-purple-700 font-medium">
                  Sera envoyé au :
                </span>
                <span className="text-sm font-bold text-purple-900 bg-purple-200/70 px-2.5 py-1 rounded-md flex items-center gap-2">
                  👨‍⚕️ Médecin traitant
                </span>
              </div>

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Ex: M. Dupont a encore des douleurs au genou..."
                className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-4 text-sm"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !messageContent.trim()}
                  className={`px-4 py-2 text-white rounded-lg font-semibold transition ${isSending || !messageContent.trim() ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                >
                  {isSending ? "Envoi..." : "Envoyer la consigne"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> // Fin du div principal <div className="flex flex-1...">
  );
}
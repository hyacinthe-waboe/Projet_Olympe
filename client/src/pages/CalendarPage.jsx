// src/pages/CalendarPage.jsx

import React from 'react';

// --- Icônes nécessaires pour CETTE page ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);


// --- Composants de la page Calendrier ---

const ActiveCallsBar = () => (
    <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex space-x-4">
            {/* Appel 1 */}
            <div className="flex items-center justify-between p-2 px-3 bg-gray-100 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                    <PhoneIcon />
                    <span className="font-medium text-sm">Appel entrant de 01 23 45 67 89</span>
                    <span className="text-sm text-gray-600">Médecin Dupont</span>
                </div>
                <button className="ml-4 text-gray-500 hover:text-gray-800"><CloseIcon /></button>
            </div>
            {/* Appel 2 */}
            <div className="flex items-center justify-between p-2 px-3 bg-gray-100 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                    <PhoneIcon />
                    <span className="font-medium text-sm">Appel entrant de 09 87 65 43 21</span>
                    <span className="text-sm text-gray-600">M. DURAND</span>
                </div>
                <button className="ml-4 text-gray-500 hover:text-gray-800"><CloseIcon /></button>
            </div>
        </div>
    </div>
);

const CalendarToolbar = () => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Février 2021</h2>
            <div className="flex items-center">
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronLeftIcon /></button>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRightIcon /></button>
            </div>
            <div className="flex items-center border rounded-md">
                <button className="px-3 py-1 text-sm bg-gray-100 border-r rounded-l-md">Mois</button>
                <button className="px-3 py-1 text-sm bg-white font-semibold rounded-r-md">Semaine</button>
            </div>
        </div>
        <div className="flex items-center space-x-3">
            <button className="text-sm font-medium px-3 py-1.5 border rounded-md shadow-sm">Aujourd'hui</button>
            <button className="text-sm font-medium px-3 py-1.5 border rounded-md shadow-sm flex items-center">
                Sem. <ChevronDownIcon />
            </button>
        </div>
    </div>
);

const CalendarGrid = () => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const dates = [8, 9, 10, 11, 12, 13, 14];
    const times = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* En-têtes de jours */}
            <div className="grid grid-cols-7 border-b border-gray-200">
                {days.map((day, i) => (
                    <div key={day} className="text-center py-3 border-r border-gray-200">
                        <p className="text-xs text-gray-500">{day}</p>
                        <p className="text-lg font-medium">{dates[i]}</p>
                    </div>
                ))}
            </div>
            {/* Grille des heures */}
            <div className="flex-1 overflow-y-auto">
                <div className="relative grid grid-cols-7">
                    {/* Lignes d'heures */}
                    <div className="col-span-full grid divide-y divide-gray-100">
                        {times.map(time => (
                            <div key={time} className="h-20 flex">
                                <div className="w-16 text-right pr-2 pt-1 text-xs text-gray-500">{time}</div>
                                <div className="flex-1 border-l border-gray-200"></div>
                            </div>
                        ))}
                    </div>
                    {/* Lignes de colonnes */}
                    <div className="absolute inset-0 grid grid-cols-7 divide-x divide-gray-200 ml-16">
                        {Array(7).fill(0).map((_, i) => <div key={i}></div>)}
                    </div>
                    
                    {/* Événements (Positionnés manuellement pour l'exemple) */}
                    <div className="absolute top-0 left-0 w-full h-full ml-16 grid grid-cols-7">
                        {/* RDV M. Dupont */}
                        <div className="col-start-1" style={{gridRow: '2 / span 2'}}>
                            <div className="bg-blue-100 text-blue-800 p-2 m-1 rounded-lg text-xs overflow-hidden" style={{height: 'calc(100% - 0.5rem)'}}>
                                <p className="font-semibold">RDV M. Dupont</p>
                                <p>8h - 10h</p>
                            </div>
                        </div>
                        {/* RDV Mme. MARTIN */}
                        <div className="col-start-3" style={{gridRow: '4 / span 2'}}>
                            <div className="bg-green-100 text-green-800 p-2 m-1 rounded-lg text-xs overflow-hidden" style={{height: 'calc(100% - 0.5rem)'}}>
                                <p className="font-semibold">RDV</p>
                                <p>Mme. MARTIN</p>
                                <p>10h - 12h</p>
                            </div>
                        </div>
                        {/* Réunion */}
                        <div className="col-start-4" style={{gridRow: '3 / span 2'}}>
                             <div className="bg-indigo-100 text-indigo-800 p-2 m-1 rounded-lg text-xs overflow-hidden" style={{height: 'calc(100% - 0.5rem)'}}>
                                <p className="font-semibold">Réunion</p>
                                <p>9h - 10h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RightSidebar = () => {
    const miniCalendarDays = ["Lun", "Mar", "Jeu", "Ven", "Sam", "Dim"]; // Oublié Mer
    const miniCalendarDates = [
        1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28
    ];

    return (
        <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col p-4 space-y-4">
            {/* Client Select */}
            <div className="flex items-center justify-between p-2 bg-white border rounded-md shadow-sm">
                <span className="text-sm font-medium">Client: Médecin Dupont</span>
                <ChevronDownIcon />
            </div>

            {/* Mini Calendrier */}
            <div className="bg-white p-4 rounded-md border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Février 2021</h3>
                    <div className="flex">
                        <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronLeftIcon /></button>
                        <button className="p-1 text-gray-500 hover:bg-gray-100 rounded"><ChevronRightIcon /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {miniCalendarDays.map(day => <div key={day} className="text-gray-500">{day}</div>)}
                    <div>Mer</div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2 text-center text-sm">
                    {miniCalendarDates.map(date => (
                        <div key={date} className={`p-1 rounded-full ${date === 12 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                            {date}
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-4 rounded-md border shadow-sm flex-1">
                <h3 className="font-semibold mb-2">Note 1</h3>
                <div className="h-24 bg-gray-50 rounded-md"></div>
            </div>
            <div className="bg-white p-4 rounded-md border shadow-sm flex-1">
                <h3 className="font-semibold mb-2">Note 2</h3>
                <div className="h-24 bg-gray-50 rounded-md"></div>
            </div>
        </div>
    );
}

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function CalendarPage() {
  return (
    <div className="flex flex-1 overflow-hidden bg-gray-100">
        
        {/* Colonne principale du calendrier */}
        <div className="flex-1 flex flex-col">
            <ActiveCallsBar />
            <CalendarToolbar />
            <CalendarGrid />
        </div>

        {/* Barre latérale de droite */}
        <RightSidebar />
    </div>
  );
}
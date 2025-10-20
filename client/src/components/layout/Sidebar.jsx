// src/components/global/Sidebar.jsx
import React from 'react';
import SidebarIcon from './SidebarIcon';
import { 
    PhoneIcon, 
    UserGroupIcon, 
    CalendarIcon, 
    ChatBubbleLeftIcon, 
    EnvelopeIcon, 
    DocumentTextIcon, 
    MagnifyingGlassCircleIcon // Utilisez-la pour le 'Logo' en haut
} from '@heroicons/react/24/outline'; 
// Rappel : vous devez avoir installé Heroicons : npm install @heroicons/react

const Sidebar = () => {
    return (
        <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
            
            {/* LOGO ou Icône du haut */}
            <div className="h-12 w-12 flex items-center justify-center font-bold border border-gray-300 rounded-lg mb-6">
                <MagnifyingGlassCircleIcon className="h-8 w-8 text-gray-700" />
            </div>

            {/* Section des icônes principales */}
            <nav className="flex flex-col items-center flex-1">
                <SidebarIcon Icon={PhoneIcon} active={true} />         {/* Téléphone (Actif) */}
                <SidebarIcon Icon={UserGroupIcon} active={false} />    {/* Contacts */}
                <SidebarIcon Icon={CalendarIcon} active={false} />     {/* Calendrier */}
            </nav>

            {/* Section des icônes du bas (Messages/Documents) */}
            <nav className="flex flex-col items-center">
                <SidebarIcon Icon={ChatBubbleLeftIcon} active={false} /> {/* Chat/Messages */}
                <SidebarIcon Icon={EnvelopeIcon} active={false} />       {/* Email */}
                <SidebarIcon Icon={DocumentTextIcon} active={false} />   {/* Documents */}
            </nav>

        </div>
    );
};

export default Sidebar;
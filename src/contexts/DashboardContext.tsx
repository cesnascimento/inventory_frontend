import React, { createContext, useState, useContext } from 'react';


interface DashboardContextType {
  filteredDashboard: string;
  setFilteredDashboard: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC = ({ children }) => {
  const [filteredDashboard, setFilteredDashboard] = useState<string>('all');
  console.log('FILTER',filteredDashboard)

  return (
    <DashboardContext.Provider value={{ filteredDashboard, setFilteredDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Crie um hook customizado para usar o contexto
export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext deve ser usado dentro do DashboardProvider');
  }
  return context;
};

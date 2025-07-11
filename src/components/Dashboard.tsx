
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ActiveInvitations } from './ActiveInvitations';
import { InvitationHistory } from './InvitationHistory';
import { CreateInvitationModal } from './CreateInvitationModal';

export const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-koto-gray-dark">
            Panel de Control
          </h1>
          <p className="text-koto-gray-dark/70 mt-1">
            Gestiona tus invitaciones de manera fácil y segura
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Invitación
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-effect h-12">
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white font-medium"
          >
            Invitaciones Vigentes
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:gradient-primary data-[state=active]:text-white font-medium"
          >
            Historial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <ActiveInvitations />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <InvitationHistory />
        </TabsContent>
      </Tabs>

      <CreateInvitationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

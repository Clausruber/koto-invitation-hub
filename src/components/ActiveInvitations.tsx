
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { InvitationCard } from './InvitationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export const ActiveInvitations = () => {
  const { user } = useAuthStore();
  const { getActiveInvitations } = useInvitationStore();
  
  if (!user) return null;
  
  const activeInvitations = getActiveInvitations(user.residentId);

  if (activeInvitations.length === 0) {
    return (
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-koto-blue/10 rounded-full flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-koto-blue" />
          </div>
          <CardTitle className="text-xl text-koto-gray-dark">
            No hay invitaciones vigentes
          </CardTitle>
          <CardDescription className="text-koto-gray-dark/70">
            Crea tu primera invitación usando el botón "Nueva Invitación"
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-koto-gray-dark/70 mb-4">
        Tienes {activeInvitations.length} invitación{activeInvitations.length !== 1 ? 'es' : ''} vigente{activeInvitations.length !== 1 ? 's' : ''}
      </p>
      
      <div className="grid gap-4">
        {activeInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};

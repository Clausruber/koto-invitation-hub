
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { InvitationCard } from './InvitationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export const InvitationHistory = () => {
  const { user } = useAuthStore();
  const { getInvitationHistory } = useInvitationStore();
  
  if (!user) return null;
  
  const invitationHistory = getInvitationHistory(user.residentId);

  if (invitationHistory.length === 0) {
    return (
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-koto-green/10 rounded-full flex items-center justify-center mb-4">
            <History className="h-8 w-8 text-koto-green" />
          </div>
          <CardTitle className="text-xl text-koto-gray-dark">
            No hay historial disponible
          </CardTitle>
          <CardDescription className="text-koto-gray-dark/70">
            Tus invitaciones aparecerán aquí una vez que las creates
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-koto-gray-dark/70 mb-4">
        Total de invitaciones creadas: {invitationHistory.length}
      </p>
      
      <div className="grid gap-4">
        {invitationHistory
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              showActions={false}
            />
          ))}
      </div>
    </div>
  );
};

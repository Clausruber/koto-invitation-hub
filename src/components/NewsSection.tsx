
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNews } from '@/hooks/useNews';
import { Newspaper, Calendar, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const NewsSection = () => {
  const { news, loading } = useNews();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-koto-blue/10 rounded-full flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-koto-blue" />
          </div>
          <CardTitle className="text-xl text-koto-gray-dark">
            No hay noticias disponibles
          </CardTitle>
          <p className="text-koto-gray-dark/70">
            Las noticias aparecerán aquí cuando estén disponibles
          </p>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-koto-gray-dark/70 mb-4">
        {news.length} noticia{news.length !== 1 ? 's' : ''} disponible{news.length !== 1 ? 's' : ''}
      </p>
      
      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id} className="glass-effect border-0 shadow-lg card-hover">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-koto-gray-dark">
                      {item.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-koto-gray-dark/70 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.fecha)}</span>
                    </div>
                  </div>
                </div>
                
                <Badge variant="default" className="gradient-secondary text-white">
                  Noticia
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {item.imageUrl && (
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div>
                <p className="text-koto-gray-dark/80 leading-relaxed">
                  {item.noticia}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

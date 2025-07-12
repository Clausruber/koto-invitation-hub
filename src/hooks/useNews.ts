
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las noticias",
          variant: "destructive"
        });
        return;
      }

      const formattedNews: News[] = data.map(item => ({
        id: item.id,
        name: item.name,
        noticia: item.noticia,
        fecha: item.fecha,
        imageUrl: item.image_url,
        userId: item.user_id,
        createdAt: item.created_at
      }));

      setNews(formattedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    refetch: fetchNews
  };
};

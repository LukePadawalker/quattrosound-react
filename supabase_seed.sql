-- Seed data for portfolio_items table
-- This script adds fake items for testing the Portfolio and Admin Panel

INSERT INTO public.portfolio_items (title, description, category, location, image_url)
VALUES
('Concerto Live Roma', 'Setup audio e luci per un concerto rock all''aperto nel centro di Roma.', 'AUDIO', 'Roma, Italia', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200'),
('Evento Aziendale Tech', 'Sistema audio per conferenza internazionale con oltre 500 partecipanti.', 'VIDEO', 'Milano, Italia', 'https://images.unsplash.com/photo-1505373630103-aa59b711f180?auto=format&fit=crop&q=80&w=1200'),
('Festival Luci d''Inverno', 'Installazione architettonica di luci per il festival cittadino.', 'LUCI', 'Torino, Italia', 'https://images.unsplash.com/photo-1514525253361-b83a65c0d27f?auto=format&fit=crop&q=80&w=1200'),
('Sfilata Alta Moda', 'Supporto tecnico e passerella con maxischermi LED per sfilata di moda.', 'STRUTTURE', 'Firenze, Italia', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'),
('Teatro all''Aperto', 'Service audio/luci completo per una rassegna teatrale estiva.', 'AUDIO', 'Napoli, Italia', 'https://images.unsplash.com/photo-1503094795297-4111b74a0b92?auto=format&fit=crop&q=80&w=1200'),
('Festa di Gala Villa', 'Illuminazione d''atmosfera e sound system discreto per una serata di gala.', 'PROGETTI', 'Venezia, Italia', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200');

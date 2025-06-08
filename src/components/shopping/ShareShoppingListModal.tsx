
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList?: any;
  items: any[];
  ingredients: any[];
}

export const ShareShoppingListModal: React.FC<ShareShoppingListModalProps> = ({
  isOpen,
  onClose,
  shoppingList,
  items,
  ingredients
}) => {
  const [email, setEmail] = useState('');

  const shareViaWhatsApp = () => {
    const listName = shoppingList?.name || 'Ma liste de courses';
    const message = `Voici ma liste de courses "${listName}" ! 🛒`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success('Partage WhatsApp ouvert');
    onClose();
  };

  const shareViaEmail = () => {
    if (!email) {
      toast.error('Veuillez saisir un email');
      return;
    }

    const listName = shoppingList?.name || 'Ma liste de courses';
    const subject = `Liste de courses - ${listName}`;
    const body = `Bonjour,\n\nJe partage avec vous ma liste de courses "${listName}".\n\nCordialement`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    toast.success('Email de partage envoyé');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager la liste
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Partager par email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={shareViaEmail} className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button onClick={shareViaWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Bell, 
  MapPin, 
  HardDrive, 
  FileText, 
  LogOut,
  Trash2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: false,
    privateAccount: false,
    voiceNotifications: true,
    marketplaceNotifications: true,
    mealReminders: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Paramètre mis à jour');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleExportData = () => {
    toast.success('Export de données démarré');
  };

  const handleDeleteAccount = () => {
    toast.error('Fonctionnalité de suppression de compte à venir');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Activer les notifications</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-notifications">Notifications vocales</Label>
                <Switch
                  id="voice-notifications"
                  checked={settings.voiceNotifications}
                  onCheckedChange={(checked) => handleSettingChange('voiceNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketplace-notifications">Notifications du marché</Label>
                <Switch
                  id="marketplace-notifications"
                  checked={settings.marketplaceNotifications}
                  onCheckedChange={(checked) => handleSettingChange('marketplaceNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="meal-reminders">Rappels de repas</Label>
                <Switch
                  id="meal-reminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => handleSettingChange('mealReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité et sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="private-account">Compte privé</Label>
                  <p className="text-sm text-gray-500">Vos plats ne seront visibles que par vous</p>
                </div>
                <Switch
                  id="private-account"
                  checked={settings.privateAccount}
                  onCheckedChange={(checked) => handleSettingChange('privateAccount', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-sharing">Partage de localisation en temps réel</Label>
                  <p className="text-sm text-gray-500">Permettre aux vendeurs de voir votre position</p>
                </div>
                <Switch
                  id="location-sharing"
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => handleSettingChange('locationSharing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stockage et données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Stockage et données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Espace utilisé</p>
                  <p className="text-sm text-gray-500">245 MB / 1 GB</p>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exporter mes données
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info('Nettoyage du cache effectué')}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Vider le cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Légal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Légal et assistance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Politique de confidentialité
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Conditions d'utilisation
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Centre d'aide
              </Button>
            </CardContent>
          </Card>

          {/* Actions dangereuses */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zone de danger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

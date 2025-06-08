
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, User, Calendar, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FamilyMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  birth_date?: string;
  gender?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  dietary_restrictions?: string[];
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onEdit,
  onDelete
}) => {
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.photo_url} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              {member.birth_date && (
                <p className="text-sm text-gray-500">
                  {getAge(member.birth_date)} ans
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(member)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(member.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {member.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{member.email}</span>
          </div>
        )}
        
        {member.phone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{member.phone}</span>
          </div>
        )}
        
        {member.birth_date && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {format(new Date(member.birth_date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        )}
        
        {member.gender && (
          <div className="text-sm">
            <span className="text-gray-500">Sexe: </span>
            <span className="capitalize">{member.gender}</span>
          </div>
        )}
        
        {(member.height || member.weight) && (
          <div className="text-sm">
            {member.height && (
              <span className="text-gray-500">Taille: <span className="text-gray-900">{member.height}cm</span></span>
            )}
            {member.height && member.weight && <span className="mx-2">•</span>}
            {member.weight && (
              <span className="text-gray-500">Poids: <span className="text-gray-900">{member.weight}kg</span></span>
            )}
          </div>
        )}
        
        {member.allergies && member.allergies.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Allergies:</p>
            <div className="flex flex-wrap gap-1">
              {member.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {member.dietary_restrictions && member.dietary_restrictions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Restrictions alimentaires:</p>
            <div className="flex flex-wrap gap-1">
              {member.dietary_restrictions.map((restriction, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

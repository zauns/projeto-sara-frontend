import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "../../services/userServices";
import { Mail, Phone, MapPin } from "lucide-react";

type ApprovalCardProps = {
  profile: UserProfile;
  onApprove: (id: string) => void;
};

export function ApprovalCard({ profile, onApprove }: ApprovalCardProps) {
  const handleApproveClick = () => {
    onApprove(profile.id);
  };

  return (
    <Card className="w-full bg-white flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg text-black">{profile.name}</CardTitle>
        <CardDescription className="text-gray-700 capitalize">
          {profile.accountType === "EMPRESA"
            ? "Empresa"
            : "Secretaria de Município"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="truncate" title={profile.email}>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{profile.telephone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="truncate" title={profile.address}>{profile.address}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleApproveClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
        >
          Aprovar
        </Button>
      </CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type JobCardProps = {
  jobType: string;
  title: string;
  location: string;
  modality: string;
  companyName: string;
  postTime: string;
  companyLogoUrl?: string;
};

export function JobCard(props: JobCardProps) {
  return (
    <div className="p-3">
      <Card className="w-full bg-white">
        <CardContent className="p-4">
          <div>
            <CardDescription className="text-gray-700">
              {props.jobType}
            </CardDescription>
            <CardTitle className="text-lg text-black">{props.title}</CardTitle>
            <CardDescription className="text-gray-700">
              {props.location} - {props.modality}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Avatar>
              <AvatarImage src={props.companyLogoUrl} alt={props.companyName} />
              <AvatarFallback>
                <User className="h-5 w-5 text-gray-700" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{props.companyName}</span>
              <span className="text-sm text-gray-600">
                {props.postTime} atrás
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

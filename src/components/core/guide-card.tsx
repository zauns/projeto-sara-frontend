import { Card, CardContent, CardDescription, CardTitle, CardFooter} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Image from 'next/image';

type GuideCardProps = {
    imageUrl: string;
    category: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorTitle: string;
    authorImageUrl?: string;

}

export function GuideCard(props: GuideCardProps) {
    return (
        <div className="p-3 w-full">
            <Card className="w-full bg-slate-50 overflow-hidden">
                
                <div className="relative h-40 w-full">   
                    <Image
                        src={props.imageUrl}
                        alt={props.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                
                <CardContent className="p-4">
                    <div>
                        <span className="text-sm font-semibold text-purple-600">
                            {props.category}
                        </span>

                        <CardTitle className="text-lg text-gray-900">
                            {props.title}
                        </CardTitle>

                        <CardDescription className="text-gray-600">
                            {props.excerpt}
                        </CardDescription>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={props.authorImageUrl} alt={props.authorName} />
                                <AvatarFallback>
                                    <User className="h-5 w-5 text-gray-600" />
                                </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{props.authorName}</span>
                            <span className="text-sm text-gray-600">{props.authorTitle}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
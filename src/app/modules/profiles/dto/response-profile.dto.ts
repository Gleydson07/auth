import { DocumentTypeEnum, GenderEnum } from './create-profile.dto';

export class ResponseProfileDto {
  id: number;
  userId: number;
  birthDay?: Date;
  phone?: string;
  gender?: GenderEnum;
  document: string;
  documentType?: DocumentTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

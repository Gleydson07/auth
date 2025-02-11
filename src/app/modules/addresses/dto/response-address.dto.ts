export class ResponseAddressDto {
  id: Number;
  userId: Number;
  neighborhood: String;
  street?: String;
  number?: String;
  city: String;
  country: String;
  zipCode: String;
  createdAt: Date;
  updatedAt: Date;
}

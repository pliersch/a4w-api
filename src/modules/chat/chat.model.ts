export interface CreateMessageDto {
  userId: string;
  // chatId: string;
  text: string;
  pictures: File[];
}

export interface QueryMessagesDto {
  chatId: string;
  from: number;
  take: number;
}

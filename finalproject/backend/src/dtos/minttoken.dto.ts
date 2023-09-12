import { ApiProperty } from "@nestjs/swagger";

export class MintRequest {
  @ApiProperty({type: String, required: true})
  address: string;

  @ApiProperty({type: Number, required: true})
  quantity: number;
}

export class MintResponse {
  @ApiProperty({type: Boolean, required: true})
  success: boolean;

  @ApiProperty({type: String, required: true})
  transactionHash: string;
}

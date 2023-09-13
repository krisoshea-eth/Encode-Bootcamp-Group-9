import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MintRequest, MintResponse } from './dtos/minttoken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('other-thing')
  getOtherThings(): string {
    return "Other Thing";
  }

  @Get('get-address')
  getTokenAddress(): string {
    return this.appService.getTokenAddress();
  }

  @Get('get-total-supply')
  getTotalSupply(): Promise<BigInt> {
    return this.appService.getTotalSupply();
  }

  @Get('get-token-balance/:address')
  getTokenBalance(@Param('address') address: string): Promise<BigInt> {
    return this.appService.getTokenBalance(address);
  }

  @Post('mint')
  mintTokens(@Body() body: MintRequest): Promise<MintResponse> {
    return this.appService.mintToken(body.address, body.quantity);
  }
}

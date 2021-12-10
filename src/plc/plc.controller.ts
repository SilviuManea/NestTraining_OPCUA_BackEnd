import { Controller, Get } from '@nestjs/common';
import { PlcService } from './plc.service';

@Controller('plc')
export class PlcController {

    constructor(private PlcService: PlcService) {}

    @Get()
    getHello(): Promise<void>  {
        return this.PlcService.LanzaConexion_PLCSim();
    }

}

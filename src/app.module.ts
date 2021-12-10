import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlcController } from './plc/plc.controller';
import { PlcModule } from './plc/plc.module';

@Module({
  imports: [PlcModule],
  controllers: [AppController,PlcController],
  providers: [AppService,]

})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlcModule } from './plc/plc.module';

@Module({
  imports: [PlcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

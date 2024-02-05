import { Global, Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { User } from 'entities/user.entity';

@Module({
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MenuService] //Optional, dùng để chia sẻ instance của menuservice cho các module khác có thể sử dụng
    //Để sử dụng ở module khác, cần imports module MenuModule và sử dụng
})
export class MenuModule {}


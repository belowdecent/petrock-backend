import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5434,
      username: "postgres",
      password: "123",
      database: "test",
      entities: [],
      synchronize: true
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

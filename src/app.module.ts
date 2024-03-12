import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { CompaniesModule } from './companies/companies.module';
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/passport/jwt-auth.guard";
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   "mongodb+srv://nestjsBasic:XF1yVWmbDD27YFZ5@cluster0.xfuiptd.mongodb.net/"
    // ),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 2,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
    FilesModule,
    ResumesModule,
    PermissionsModule,
    RolesModule,
    DatabasesModule,
    SubscribersModule,
    MailModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
      {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
  ],
})
export class AppModule {}

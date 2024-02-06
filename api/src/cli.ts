// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';
// import { ButtonCron } from './modules/button/button.cron';
// import { configFileName } from './shared/helpers/config-name.const';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(
//     AppModule,
//   );
// //   const configs = require(`@src/../../${configFileName}`);

//   const command = process.argv[2];

// //   switch (command) {
// //     case 'create-administrator-user':
// //       const usersService = application.get(UsersService);
// //       await usersService.create({
// //         username: 'administrator',
// //         password: 'password',
// //       });
// //       break;
// //     default:
// //       console.log('Command not found');
// //       process.exit(1);
// //   }

//   switch (command) {
//     case 'cron-remove-past-events':{
//       const buttonCron = app.get(ButtonCron);
//       await buttonCron.clearEventButtons();
//       break;
//     }
//     case 'cron-remove-old-buttons':{
//       const buttonCron = app.get(ButtonCron);
//       await buttonCron.clearOldButtons();
//       break;
//     }
//     default:{
//       console.log('command not found')
//     }
//   }
// //   process.exit(1);

//   await app.close();
//   process.exit(0);
// }

// bootstrap();

// import { BootstrapConsole } from 'nestjs-console';
// // import { ButtonCron } from './modules/button/button.cron';
// import { ButtonModule } from './modules/button/button.module';

// // import { MyModule } from './module';

// const bootstrap = new BootstrapConsole({
//     module: ButtonModule,
//     useDecorators: true
// });
// bootstrap.init().then(async (app) => {
//     try {
//         await app.init();
//         await bootstrap.boot();
//               const buttonCron = app.get(ButtonCron);
//       await buttonCron.clearEventButtons();
//         await app.close();
//     } catch (e) {
//         console.error(e);
//         await app.close();
//         process.exit(1);
//     }
// });

import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

process.on('unhandledRejection', (error) => {
  if (error) console.log(error);
});
bootstrap();

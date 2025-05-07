import { NestFactory } from '@nestjs/core';
// import { CommandModule, CommandService } from 'nestjs-command';
import { SetupModule } from './modules/setup/setup.module';
import { AppModule } from './app/app.module';

async function bootstrap () {

  let module ;
  
  if(process.argv.length > 1 && ['config:genjwt', 'config:convert'].indexOf(process.argv[2]) > -1)
  {
    // console.log('using setup module')
    module = SetupModule
  }else{
    // console.log('using app module')
    module = AppModule
  }

  const app = await NestFactory.createApplicationContext(module, {
    logger: ['error', 'warn']
  });
  try {
    // await app
      // .select(CommandModule)
      // .get(CommandService)
      // .exec();
    await app.close()
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}
process.on('unhandledRejection', reason => {
  console.log(reason)
  return;
});

bootstrap();
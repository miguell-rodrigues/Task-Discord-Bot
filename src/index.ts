import { Client, MessageEmbed } from 'discord.js';
import Matter from './model/Matter';
import api from './services/api';
import MatterController from './controller/MatterController';

const client = new Client();

var matters = Array<Matter>();
var names = Array<string>();

client.on('ready', async () => {
  await api.get('/matters').then((response) => {
    const data = response.data as Array<{}>;

    data.map((matt) => {
      const m = matt as Matter;

      matters.push(m);
      names.push(m.name.toLowerCase());
    });
  });

  let i = 0;
  const activities = [`Uma dádiva dos Ninjas !`, `Digite |help para ajuda`];

  setInterval(
    () =>
      client.user?.setActivity(`${activities[i++ % activities.length]}`, {
        type: 'LISTENING',
      }),
    5000,
  );

  client.user?.setStatus('online').catch(console.log);
});

client.on('message', async (message) => {
  if (message.content.startsWith('!')) {
    const reply = new MessageEmbed().setTitle('Boa noite presidente Lula');

    return message.channel.send(reply);
  } else if (message.content.startsWith('.')) {
    if (matters.length == 0) {
      message.channel.send('Nao foram encontradas materias');
      return;
    }

    const action = message.content.replace('.', '');

    if (action.includes(':')) {
      const split = action.split(':');

      const option = split[0];
      const classy = split[1];

      const reply = new MessageEmbed();
      reply.setColor('#3260a8');

      if (!names.includes(classy.toLowerCase())) {
        message.channel.send('Materia não encontrada');
        return;
      }

      const matter = MatterController.getMatterByName(matters, classy);

      if (!matter) {
        return;
      }

      if (option == 'atividades') {
        if (matter.tasks.length > 0) {
          let x = 0;

          const notPastTasks = matter.tasks.filter(
            (task) => !MatterController.past(task),
          );

          x = notPastTasks.length;

          if (x == 0) {
            message.channel.send('Não foram encontradas atividades');
            return;
          }

          const reply = new MessageEmbed();

          reply.title = 'Atividades de ' + matter.name;
          reply.setFooter(`Professor: ${matter.teacher}`);
          reply.setDescription('\n');

          notPastTasks.forEach((task) => {
            reply.setDescription(
              reply.description +
                '\n\n_Id_: ' +
                task.id +
                '\n\nDescrição: ' +
                task.description +
                '\nData: ' +
                MatterController.getTime(task.deliveryTime) +
                '\nTempo restante: ' +
                MatterController.getRemainingTime(task) +
                '\n',
            );

            reply.setColor(MatterController.getColor(task));
          });

          message.channel.send(reply);
        } else {
          message.channel.send('Não foram encontradas atividades');
        }
      } else if (option == 'arquivos') {
        let foundFiles = false;

        reply.setDescription('\n');

        matter.tasks.forEach((task) => {
          if (task.files.length > 0) {
            foundFiles = true;

            task.files.forEach((file) => {
              reply.setDescription(reply.description + `\nURL: ${file.url}\n`);
            });
          }
        });

        if (!foundFiles) {
          message.channel.send('Não foram encontrados arquivos');
          return;
        }

        reply.setTitle('Arquivos de ' + matter.name);
        reply.setColor('#34eb92');

        message.channel.send(reply);
      } else if (option == 'passadas') {
        if (matter.tasks.length > 0) {
          let x = 0;

          const pastTasks = matter.tasks.filter((task) =>
            MatterController.past(task),
          );

          x = pastTasks.length;

          if (x == 0) {
            message.channel.send(
              'Nao foram encontradas atividades passadas desta matéria',
            );
            return;
          }

          const reply = new MessageEmbed();

          reply.title = 'Atividades passadas de ' + matter.name;
          reply.setFooter(`Professor: ${matter.teacher}`);
          reply.setDescription('\n');

          pastTasks.forEach((task) => {
            reply.setDescription(
              reply.description +
                '\n\n_Id_: ' +
                task.id +
                '\n\nDescrição: ' +
                task.description +
                '\nData: ' +
                MatterController.getTime(task.deliveryTime) +
                '\nTempo restante: ' +
                MatterController.getRemainingTime(task) +
                '\n',
            );

            reply.setColor(MatterController.getColor(task));
          });

          message.channel.send(reply);
        } else {
          message.channel.send(
            'Nao foram encontradas atividades passadas desta matéria',
          );
        }
      }
    } else {
      switch (action) {
        case 'atividades':
          if (matters.length == 0) {
            message.channel.send('Não foram encontradas materias');
            return;
          }

          matters.forEach((matter) => {
            if (matter.tasks.length > 0) {
              let x = 0;

              const notPastTasks = matter.tasks.filter(
                (task) => !MatterController.past(task),
              );

              x = notPastTasks.length;

              if (x == 0) {
                message.channel.send('Não foram encontradas atividades');
                return;
              }

              const reply = new MessageEmbed();

              reply.title = 'Atividades de ' + matter.name;
              reply.setFooter(`Professor: ${matter.teacher}`);
              reply.setDescription('\n');

              notPastTasks.forEach((task) => {
                reply.setDescription(
                  reply.description +
                    '\n\n_Id_: ' +
                    task.id +
                    '\n\nDescrição: ' +
                    task.description +
                    '\nData: ' +
                    MatterController.getTime(task.deliveryTime) +
                    '\nTempo restante: ' +
                    MatterController.getRemainingTime(task) +
                    '\n',
                );

                reply.setColor(MatterController.getColor(task));
              });
              message.channel.send(reply);
            }
          });

          break;

        case 'passadas':
          if (matters.length == 0) {
            message.channel.send('Não foram encontradas materias');
            return;
          }

          let found = false;

          matters.forEach((matter) => {
            if (matter.tasks.length > 0) {
              let y = 0;

              const pastTasks = matter.tasks.filter((task) =>
                MatterController.past(task),
              );

              y = pastTasks.length;

              if (y == 0) {
                return;
              }

              found = true;

              const reply = new MessageEmbed();

              reply.title = 'Atividades passadas de ' + matter.name;
              reply.setFooter(`Professor: ${matter.teacher}`);
              reply.setDescription('\n');

              pastTasks.forEach((task) => {
                reply.setDescription(
                  reply.description +
                    '\n\n_Id_: ' +
                    task.id +
                    '\n\nDescrição: ' +
                    task.description +
                    '\nData: ' +
                    MatterController.getTime(task.deliveryTime) +
                    '\nTempo restante: ' +
                    MatterController.getRemainingTime(task) +
                    '\n',
                );

                reply.setColor(MatterController.getColor(task));
              });

              message.channel.send(reply);
            }
          });

          if (!found) {
            message.channel.send('Nao foram encontradas atividades passadas');
          }

          break;

        default:
          break;
      }
    }
  } else if (message.content.startsWith('?')) {
    const id = message.content.replace('?', '');

    await api.get(`/tasks/remainingTime/${id}`).then((response) => {
      const { remainingTime } = response.data;

      const reply = new MessageEmbed();

      reply.setTitle('Tempo restante');
      reply.setDescription('\n' + remainingTime);

      message.channel.send(reply);
    });
  } else if (message.content.startsWith('|')) {
    const content = message.content.replace('|', '').toLowerCase();

    if (content == 'help') {
      const reply = new MessageEmbed();

      reply.setTitle('Comandos');

      reply
        .addFields([
          { name: '\u200B', value: '\u200B' },

          { name: 'Atividades', value: '.atividades', inline: true },
          {
            name: 'Atividades passadas',
            value: '.passadas',
            inline: true,
          },

          { name: '\u200B', value: '\u200B' },

          {
            name: 'Atividades especificas    ',
            value: '.atividades:materia',
            inline: true,
          },
          {
            name: 'Atvividades passadas especificas',
            value: '.passadas:materia',
            inline: true,
          },

          { name: '\u200B', value: '\u200B' },

          {
            name: 'Arquivos de uma atividade',
            value: '.arquivos:materia',
            inline: true,
          },
          {
            name: 'Tempo restante de uma atividade',
            value: '?id',
            inline: true,
          },

          { name: '\u200B', value: '\u200B' },
        ])

        .attachFiles(['./src/images/icon.png'])
        .setThumbnail('attachment://icon.png')
        .setTimestamp()
        .setFooter('Autor: Miguel Lukas Rodrigues');

      reply.setColor('#24e2f0');
      reply.setDescription('\n');

      message.channel.send(reply);
    } else if (content == 'reload') {
      matters = Array<Matter>();
      names = Array<string>();

      api.get('/matters').then((response) => {
        const data = response.data as Array<{}>;

        data.map((matt) => {
          const m = matt as Matter;

          matters.push(m);
          names.push(m.name.toLowerCase());
        });
      });
    }
  }
});

client.on('guildMemberAdd', (member) => {
  member.send('Seja bem vindo');
});

client.login('');

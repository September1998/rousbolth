//ESTA LÍNEA LLAMA A LOS MÓDULOS BÁSICOS INDISPENSABLES PARA EL ROUS.
const Discord = require("discord.js");
const client = new Discord.Client();

//ESTA LINEA LLAMA AL ARCHIVO DE CONFIGURACIÓN.
const config = require("./config.json");

//INICIANDO ROUSBOLTH
client.on("ready", () => {

console.log(`\n \n \nROUSBOLTH:\n¡Estoy lista! \nConectada en ${client.guilds.size} servidores y  ${client.users.size} usuarios.`); // <-- ENVÍA UN MENSAJE CUANDO EL ROUS ESTÉ EN LÍNEA.
   client.user.setPresence( {
       status: "online",
       game: {
           name: "Florensia",
           type: "PLAYING"
       }
   } );
});

////////////////////////////////////

// ESTE ES UN COMANDO BÁSICO. EL USUARIO ESCRIBE UN COMENTARIO Y LA ROUS RESPONDE.
// ES ÚTIL PARA SABER SI LA BOT ESTÁ FUNCIONANDO CORRECTAMENTE.

var prefix = config.prefix;

client.on("message", async message => {

  ///////////////COMANDO HELP ///////////////////////////////////
	if(message.content.startsWith(prefix + 'help')){

    message.channel.send('**'+message.author.username+'**, revisa tus mensajes privados.');
    message.author.send('**Comandos de Rousbolth:**\n```\n'+
                        '-> '+prefix+'ping           :: Comprueba la latencia de Rous y de tus mensajes.\n'+
                        '-> '+prefix+'hola           :: Saludar a Rous. \n```\n\n'+
                        '**Rousbolth v. 1.1.0  - Created by September.**');
    
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  else
  if (message.content.startsWith(prefix +"Quien es tu creador?")) {
    message.channel.send("Por razones obvias no puedo revelarte el nombre de mi creador. Pero puedo darte una pista: Su nombre comienza con 'A'.");
  }
  else
  if (message.content.startsWith(prefix +"Tu creador se llama Alan?")) {
    message.channel.send("¡WoW! ¡Realmente se te da muy bien adivinar!");

  }
  else
  if (message.content.startsWith(prefix +"Como se llama tu madre?")) {
    message.channel.send("Extraño mucho a mi madre. Aún no tengo suficientes datos sobre ella, sin embargo, los demás humanos solían llamarle 'Emily'.");
  }
  
  ///////////////COMANDO PING //////////////////////

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
let texto = args.join(" ");

if (command === 'ping') {

    let ping = Math.floor(message.client.ping);
    
    message.channel.send(":ping_pong: Pong!")
      .then(m => {

          m.edit(`:incoming_envelope: Ping Mensajes: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
      
      });
    
  }
  
if(command === 'avatar'){

      let img = message.mentions.users.first()
      if (!img) {

          const embed = new Discord.RichEmbed()
          .setImage(`${message.author.avatarURL}`)
          .setColor(0x66b3ff)
          .setFooter(`Avatar de ${message.author.username}#${message.author.discriminator}`);
          message.channel.send({ embed });

      } else if (img.avatarURL === null) {

          message.channel.sendMessage("El usuario ("+ img.username +") no tiene avatar!");

      } else {

          const embed = new Discord.RichEmbed()
          .setImage(`${img.avatarURL}`)
          .setColor(0x66b3ff)
          .setFooter(`Avatar de ${img.username}#${img.discriminator}`);
          message.channel.send({ embed });

      };

  }
  //////////////////COMANDO BANEAR ///////////////////////////////
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>[config.BanRights].includes(r.name)) )
      return message.reply("\n No tienes permiso para banear usuarios.");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("\n Por favor, menciona a un usuario válido.");
    if(!member.bannable) 
      return message.reply("\n ¡Algo salió mal! ¡No puedo banear a ese usuario!\nPosiblemente tenga una jerarquía mayor a la mía.");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Sin razón.";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`\n${member.user.tag} ha sido baneado por ${message.author.tag}\nMotivo: ${reason}`);
  }
///////////////////////////////////////////////////////////////////////////
//////////////////////COMANDO EXPULSAR //////////////////////////////////////
 if(command === "kick") {
    if(!message.member.roles.some(r=>[config.KickRights].includes(r.name)) )
      return message.reply("\n No tienes permiso para banear usuarios.");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("\n Por favor, menciona un usuario válido.");
    if(!member.kickable) 
      return message.reply("\n ¡Algo salió mal! ¡No puedo expulsar a ese usuario!\nPosiblemente tenga una jerarquía mayor a la mía.");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Sin razón.";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} ha sido baneado por ${message.author.tag}\nMotivo: ${reason}`);

  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////  
/////////////////////////COMANDO PURGE //////////////////////////////////////////////////////////////////////
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
	    if(!message.member.roles.some(r=>[config.PurgeRights].includes(r.name)) )
      return message.reply("\n No tienes permiso para eliminar mensajes.");
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("\nPor favor, indícame cuántos mensajes deseas elimine (Entre 1 y 100).\nEjemplo: !purge 15");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  ///////////////////////////////////////////////////////////////////////////////////////
if(command === 'server'){

    var server = message.guild;
  
    const embed = new Discord.RichEmbed()
    .setThumbnail(server.iconURL)
    .setAuthor(server.name, server.iconURL)
    .addField('ID', server.id, true)
    .addField('Region', server.region, true)
    .addField('Creado el', server.joinedAt.toDateString(), true)
    .addField('Dueño del Servidor', server.owner.user.username+'#'+server.owner.user.discriminator+' ('+server.owner.user.id +')', true)
    .addField('Miembros', server.memberCount, true)
    .addField('Roles', server.roles.size, true)
    .setColor(0x66b3ff)
    
   message.channel.send({ embed });

  }
 
if(command === 'user'){
    let userm = message.mentions.users.first()
    if(!userm){
      var user = message.author;
      
        const embed = new Discord.RichEmbed()
        .setThumbnail(user.avatarURL)
        .setAuthor(user.username+'#'+user.discriminator, user.avatarURL)
        .addField('Actividad:', user.presence.game != null ? user.presence.game.name : "No está haciendo nada.", true)
        .addField('ID:', user.id, true)
        .addField('Estado:', user.presence.status, true)
        .addField('Apodo:', message.member.nickname != null ? user.member.nickname : "Sin apodo", true)
        .addField('Fecha de Registro:', user.createdAt.toDateString(), true)
        .addField('Fecha de Ingreso:', message.member.joinedAt.toDateString())
        .addField('Roles:', message.member.roles.map(roles => `\`${roles.name}\``).join(', '))
        .setColor(0x66b3ff)
        
       message.channel.send({ embed });
    }
	else
	{
      const embed = new Discord.RichEmbed()
      .setThumbnail(userm.avatarURL)
      .setAuthor(userm.username+'#'+userm.discriminator, userm.avatarURL)
      .addField('Actividad:', userm.presence.game != null ? userm.presence.game.name : "No está haciendo nada.", true)
      .addField('ID:', userm.id, true)
      .addField('Estado:', userm.presence.status, true)
      .addField('Fecha de registro:', userm.createdAt.toDateString(), true)
      .setColor(0x66b3ff)
      
     message.channel.send({ embed });
	}
}
////////////////////COMANDO SAY /////////////////////////////////////////
  if(command === "say") {
	if(!message.member.roles.some(r=>[config.SayRights].includes(r.name)) )
      return message.reply("\n ¡No tienes permiso para controlarme!");
  
  
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }
  
/////////////////////////////////////////////////////////////////////////////
		///////////CHATBOT ////////////////////////////////////

if(command === 'chocolate?'){
    var rpts = ["Sí", "No", "¿Por qué?", "Por favor", "Tal vez", "No sé", "Definitivamente?", " ¡Claro! "," Sí "," No "," Por supuesto! "," Por supuesto que no "];
   // if (!texto) return message.reply(`Escriba una pregunta.`);
    message.channel.send(message.member.user+ ' ' + rpts[Math.floor(Math.random() * rpts.length)]+'');

}
  
  ///////////MENSAJE EMBED //////////////////
  else
	if(message.content.startsWith(prefix +"embed")){
    message.channel.send({embed: {
      color: 9975003,
      description: (texto)
    }});
     

		
		//////////////////////////////////CONFIGURACIONES DE MENSAJES////////////////////////////////////////////////
 if (!message.content.startsWith(prefix)) return; //Si el mensaje de Rous contiene el prefijo, Cancela cualquier comando (Rous no se auto-responde).
 if (message.author.bot) return; // Si Rous envía el mensaje, finaliza el comando.
  }
////////////////////////////////////  
////////////MUSIC /////////////////////////


// TOKEN SECRETO - LOGIN DEL BOT.
});
client.login(config.token); 

////////////////////////////////////



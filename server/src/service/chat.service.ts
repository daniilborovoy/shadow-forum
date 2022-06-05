import { Server, Socket } from 'socket.io';
import MessageService from './message.service';

class ChatConnection {
  private readonly socket;
  private readonly io;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    socket.on('join_discussion', (discussionId, callback) =>
      this.joinDiscussion(discussionId, callback),
    );

    socket.on('get_discussion_messages', (discussionId, callback) =>
      this.getDiscussionMessages(discussionId, callback),
    );

    socket.on('message', (value, userId, discussionId, callback) =>
      this.sendMessage(value, userId, discussionId, callback),
    );

    // socket.on('update_message', () => {});
    // socket.on('delete_message', (messageId) => this.deleteMessage(messageId));
    socket.on('leave_discussion', (discussionId) => this.leaveDiscussion(discussionId));
    // socket.on('disconnect', () => this.disconnect());
    socket.on('disconnecting', () => {
      const rooms = this.socket.rooms;
      rooms.forEach(async (room) => {
        this.socket.to(room).emit('user_leaved');
      });
    });
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  async joinDiscussion(discussionId: string, callback: Function) {
    try {
      const allSockets = await this.io.in(discussionId).allSockets();
      await this.socket.join(discussionId);
      this.socket.to(discussionId).emit('user_joined');
      callback({
        status: 'OK',
        clientsCount: allSockets.size,
      });
    } catch (e) {
      callback({
        status: 'NOK',
        error: e,
      });
    }
  }

  async leaveDiscussion(discussionId: string) {
    await this.socket.leave(discussionId);
    this.socket.to(discussionId).emit('user_leaved');
  }

  async getDiscussionMessages(discussionId: string, callback: Function) {
    try {
      const messages = await MessageService.getMessagesByDiscussionId(discussionId);
      if (messages) {
        callback({
          status: 'OK',
          messages,
        });
      }
    } catch (e) {
      callback({
        status: 'NOK',
        error: e,
      });
    }
  }

  async sendMessage(value: string, userId: string, discussionId: string, callback: Function) {
    try {
      const message = await MessageService.saveMessage(value, userId, discussionId);
      // send message all clients in discussion room
      this.io.to(discussionId).emit('message', message);
      callback({ status: 'OK' });
    } catch (e) {
      callback({
        status: 'NOK',
        error: e,
      });
    }
  }

  // TODO удаление сообщения
  // async deleteMessage(messageId: string) {
  // }

  // disconnect(discussionId: string) {
  // }
}

const chat = (io: Server) => {
  io.on('connection', (socket: Socket) => new ChatConnection(io, socket));
};

export default chat;

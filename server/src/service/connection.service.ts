import { Server, Socket } from 'socket.io';
import MessageService from './message.service';
import { MessageDto } from '../dtos/message.dto';

class Connection {
  private readonly socket;
  private io;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    socket.on('get_msg', (discussionId) => this.getMessages(discussionId));
    socket.on('msg', (value, userId, discussionId, callback) =>
      this.handleMessage(value, userId, discussionId, callback),
    );
    socket.on('leave_discussion', (discussionId) => this.leaveDiscussion(discussionId));
    socket.on('delete_msg', (messageId) => this.deleteMessage(messageId));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(message: MessageDto | string, room: string) {
    this.io.to(room).emit('msg', message);
  }

  leaveDiscussion(discussionId: string) {
    this.socket.leave(discussionId);
  }

  async getMessages(discussionId: string) {
    await this.socket.join(discussionId);
    const clientsCount = this.io.sockets.adapter.rooms.get(discussionId)!.size || 0;
    const messages = await MessageService.getMessagesByDiscussionId(discussionId);
    if (messages) {
      this.socket.emit('old_msg', messages, clientsCount);
    }
  }

  async handleMessage(value: string, userId: string, discussionId: string, callback: Function) {
    const message = await MessageService.saveMessage(value, userId, discussionId);
    console.log(message);
    this.sendMessage(message, discussionId);
    callback();
  }

  async deleteMessage(messageId: string) {
    // TODO удаление сообщения
  }

  disconnect(): void {
    // users.delete(this.socket);
  }
}

const chat = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    new Connection(io, socket);
  });
};

export default chat;

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories;

public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
{
    private readonly DataContext _context = context;
    private readonly IMapper _mapper = mapper;

    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(int id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = _context.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username),
            "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
            _ => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null)
        };

        var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

        return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUserName, string recipientUsername)
    {
        var messages = await _context.Messages
            .Include(message => message.Sender)
            .ThenInclude(sender => sender.Photos)
            .Include(message => message.Recipient)
            .ThenInclude(recipient => recipient.Photos)
            .Where(message =>
                (message.RecipientUsername == currentUserName &&
                message.SenderUsername == recipientUsername) ||
                (message.RecipientUsername == recipientUsername &&
                message.SenderUsername == currentUserName)
            )
            .OrderByDescending(message => message.MessageSent)
            .ToListAsync();

        var unreadMessages = messages
            .Where(message => message.DateRead == null && message.RecipientUsername == currentUserName)
            .ToList();

        if (unreadMessages.Count > 0)
        {
            foreach (var message in messages)
            {
                message.DateRead = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

        return _mapper.Map<IEnumerable<MessageDTO>>(messages);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
using AutoMapper;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;

namespace Backend.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDTO>()
            .ForMember(
                // fill this property with options below
                destination => destination.PhotoUrl,
                // map to this data from the source itself
                options =>
                    options.MapFrom(source =>
                        // try to find the main photo, ?? is for cases where photo might be null
                        (
                            source.Photos.FirstOrDefault(photo => photo.IsMain)
                            ?? new Photo { Url = null! }
                        ).Url
                    )
            )
            .ForMember(
                destination => destination.Age,
                options => options.MapFrom(source => source.DateOfBirth.CalculateAge())
            );
        CreateMap<Photo, PhotoDTO>();
        CreateMap<MemberUpdateDTO, AppUser>()
            .ForAllMembers(options =>
                options.Condition((src, dest, srcMember) => srcMember != null)
            );
        CreateMap<RegisterUserDTO, AppUser>();
        CreateMap<Message, MessageDTO>()
            .ForMember(
                destination => destination.SenderPhotoUrl,
                options =>
                    options.MapFrom(source =>
                        (
                            source.Sender.Photos.FirstOrDefault(photo => photo.IsMain)
                            ?? new Photo { Url = null! }
                        ).Url
                    )
            )
            .ForMember(
                destination => destination.RecipientPhotoUrl,
                options =>
                    options.MapFrom(source =>
                        (
                            source.Recipient.Photos.FirstOrDefault(photo => photo.IsMain)
                            ?? new Photo { Url = null! }
                        ).Url
                    )
            );
    }
}

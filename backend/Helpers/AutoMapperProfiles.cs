using AutoMapper;
using Backend.DTOs;
using Backend.Entities;

namespace Backend.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDTO>()
            .ForMember(
                destination => destination.PhotoUrl,
                options => options.MapFrom(source =>
                    (source.Photos
                        .FirstOrDefault(photo => photo.IsMain) ?? new Photo { Url = null! }
                    ).Url
                )
            );
        CreateMap<Photo, PhotoDTO>();
    }
}
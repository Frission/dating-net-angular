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
                // fill this property with options below
                destination => destination.PhotoUrl,
                // map to this data from the source itself
                options => options.MapFrom(source =>
                    // try to find the main photo, ?? is for cases where photo might be null
                    (source.Photos
                        .FirstOrDefault(photo => photo.IsMain) ?? new Photo { Url = null! }
                    ).Url
                )
            );
        CreateMap<Photo, PhotoDTO>();
    }
}
﻿using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class UserDTO
{
    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Token { get; set; } = string.Empty;
}

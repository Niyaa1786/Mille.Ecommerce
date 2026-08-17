using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mille.Api.Responses;
using Mille.Application.Features.Users.AddAddress;
using Mille.Application.Features.Users.DeleteAddress;
using Mille.Application.Features.Users.GetProfile;
using Mille.Application.Features.Users.Login;
using Mille.Application.Features.Users.Logout;
using Mille.Application.Features.Users.RefreshToken;
using Mille.Application.Features.Users.Register;
using Mille.Application.Features.Users.UpdateAddress;
using Mille.Application.Features.Users.UpdateProfile;
using System.Security.Claims;

namespace Mille.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        #region 
        private readonly RegisterUseCase _registerUseCase;
        private readonly LoginUseCase _loginUseCase;
        private readonly RefreshTokenUseCase _refreshTokenUseCase;
        private readonly LogoutUseCase _logoutUseCase;
        private readonly GetProfileUseCase _getProfileUseCase;
        private readonly UpdateProfileUseCase _updateProfileUseCase;
        private readonly AddAddressUseCase _addAddressUseCase;
        private readonly UpdateAddressUseCase _updateAddressUseCase;
        private readonly DeleteAddressUseCase _deleteAddressUseCase;

        public UsersController(
            RegisterUseCase registerUseCase,
            LoginUseCase loginUseCase,
            RefreshTokenUseCase refreshTokenUseCase,
            LogoutUseCase logoutUseCase,
            GetProfileUseCase getProfileUseCase,
            UpdateProfileUseCase updateProfileUseCase,
            AddAddressUseCase addAddressUseCase,
            UpdateAddressUseCase updateAddressUseCase,
            DeleteAddressUseCase deleteAddressUseCase)
        {
            _registerUseCase = registerUseCase;
            _loginUseCase = loginUseCase;
            _refreshTokenUseCase = refreshTokenUseCase;
            _logoutUseCase = logoutUseCase;
            _getProfileUseCase = getProfileUseCase;
            _updateProfileUseCase = updateProfileUseCase;
            _addAddressUseCase = addAddressUseCase;
            _updateAddressUseCase = updateAddressUseCase;
            _deleteAddressUseCase = deleteAddressUseCase;
        }
        #endregion
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request, CancellationToken ct)
        {
            var result = await _registerUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<RegisterResponse>.Success(result, "Registration successful.");

            return Ok(res);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
        {
            var result = await _loginUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<LoginResponse>.Success(result, "Login successful.");

            return Ok(res);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest request, CancellationToken ct)
        {
            var result = await _refreshTokenUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<RefreshTokenResponse>.Success(result, "Token refreshed.");

            return Ok(res);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout(CancellationToken ct)
        {
            var userId = GetUserId();
            var request = new LogoutRequest { UserId = userId };
            var result = await _logoutUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<LogoutResponse>.Success(result, result.Message);

            return Ok(res);
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken ct)
        {
            var userId = GetUserId();
            var request = new GetProfileRequest { UserId = userId };
            var result = await _getProfileUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<GetProfileResponse>.Success(result, "Profile retrieved.");

            return Ok(res);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request, CancellationToken ct)
        {
            request.UserId = GetUserId();
            var result = await _updateProfileUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<UpdateProfileResponse>.Success(result, "Profile updated.");
            return Ok(res);
        }

        [Authorize]
        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress(AddAddressRequest request, CancellationToken ct)
        {
            request.UserId = GetUserId();
            var result = await _addAddressUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<AddAddressResponse>.Success(result, "Address added.");

            return Ok(res);
        }

        [Authorize]
        [HttpPut("addresses/{addressId}")]
        public async Task<IActionResult> UpdateAddress(int addressId, UpdateAddressRequest request, CancellationToken ct)
        {
            request.UserId = GetUserId();
            request.Id = addressId;
            var result = await _updateAddressUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<UpdateAddressResponse>.Success(result, "Address updated.");

            return Ok(res);
        }

        [Authorize]
        [HttpDelete("addresses/{addressId}")]
        public async Task<IActionResult> DeleteAddress(int addressId, CancellationToken ct)
        {
            var request = new DeleteAddressRequest {
                UserId = GetUserId(),
                AddressId = addressId 
            };
            var result = await _deleteAddressUseCase.ExecuteAsync(request, ct);
            var res = ApiResponse<DeleteAddressResponse>.Success(result, "Address deleted.");

            return Ok(res);
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID claim not found..");
            return Guid.Parse(userIdClaim);
        }
    }

}


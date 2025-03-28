using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace BuildDeploy.Demo.Controllers;

[ApiController]
[Route("[controller]")]
public class GitHubUserController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    
    public GitHubUserController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    
    
    // Visit this in the browser https://api.github.com/users/chrisyoxall
    
    // Would normally create a GitHub service rather than all the code to the controller
    
    [HttpGet("validate/{username}", Name = "ValidateGitHubUser")]
    public async Task<IActionResult> ValidateGitHubUser(string username)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("GitHub");
            var response = await client.GetAsync($"users/{username}");
             
            // User exists. Returns flag with result plus the returned data
            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<GitHubUser>();
                return Ok(new { 
                    IsValid = true, 
                    User = user 
                });
            }
            
            // User does not exist
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return Ok(new { IsValid = false });
            }
            
            
            // Handle rate limiting or other API errors
            return StatusCode((int)response.StatusCode, 
                new { Error = $"GitHub API returned status code {response.StatusCode}" });
            
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { Error = $"Error connecting to GitHub API: {ex.Message}" });
        }
    }

    private class GitHubUser
    {
        [JsonPropertyName("login")]
        public string Login { get; set; }
        
        [JsonPropertyName("id")]
        public int Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("company")]
        public string Company { get; set; }
        
        [JsonPropertyName("public_repos")]
        public int PublicRepos { get; set; }
    }
}
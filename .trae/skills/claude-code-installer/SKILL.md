---
name: "claude-code-installer"
description: "Complete installation guide for Claude Code and CC Switch on Windows. Invoke when user needs to install Claude Code, CC Switch, or set up the AI programming environment with model switching capabilities."
---

# Claude Code and CC Switch Installation Guide

This skill provides a comprehensive installation guide for Claude Code and CC Switch on Windows systems, including Git setup, environment configuration, and model switching capabilities.

## Prerequisites

- Windows operating system
- Administrator privileges (for some installations)
- Internet connection
- VPN access (for GitHub and some downloads)

## Installation Steps

### 1. Claude Code Installation

#### Method 1: WinGet (Recommended)
```powershell
winget install Anthropic.ClaudeCode
```

#### Method 2: Portable Version
```powershell
# Download Claude Code portable version
Invoke-WebRequest -Uri "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.63/win32-x64/claude.exe" -OutFile "claude.exe"

# Verify installation
.\claude.exe --version
```

#### Verification
```powershell
claude --version
# Expected output: 2.1.63 (Claude Code)
```

### 2. Git for Windows Installation

Claude Code requires git-bash to run on Windows.

#### Installation Command
```powershell
winget install Git.Git
```

#### Environment Variable Configuration
```powershell
# Set git-bash path for Claude Code
[Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'C:\Program Files\Git\bin\bash.exe', 'User')
```

#### Verification
```powershell
git --version
# Expected output: git version 2.x.x.x
```

### 3. CC Switch Installation

CC Switch is a cross-platform desktop application for managing Claude Code API configurations and switching between different AI models.

#### Download and Install
```powershell
# Download CC Switch v3.10.3
Invoke-WebRequest -Uri "https://github.com/farion1231/cc-switch/releases/download/v3.10.3/CC-Switch-v3.10.3-Windows-Portable.zip" -OutFile "$env:USERPROFILE\Downloads\CC-Switch-Portable.zip"

# Extract to desktop
Expand-Archive -Path "$env:USERPROFILE\Downloads\CC-Switch-Portable.zip" -DestinationPath "$env:USERPROFILE\Desktop\CC-Switch"

# Launch CC Switch
Start-Process "$env:USERPROFILE\Desktop\CC-Switch\cc-switch.exe"
```

### 4. Environment Variables Setup

#### Claude Code Environment Variables
```powershell
# Git bash path (required for Windows)
[Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'C:\Program Files\Git\bin\bash.exe', 'User')

# Optional: Set Claude Code workspace
[Environment]::SetEnvironmentVariable('CLAUDE_CODE_WORKSPACE', 'E:\Claude code\Claude code', 'User')
```

#### Refresh Environment Variables
After setting environment variables, restart your terminal or run:
```powershell
refreshenv
# Or manually reload PowerShell
```

## CC Switch Configuration

### Supported Models

#### Official Claude Models
- Claude Sonnet (claude-sonnet-4-6)
- Claude Opus (claude-opus-4-6)
- Claude Haiku (claude-haiku-4-6)

#### Chinese AI Models (Cost-effective alternatives)
- **智谱 GLM-4.7**: High-performance Chinese language model
- **MiniMax M2.1**: Cost-effective alternative with good performance
- **DeepSeek**: Open-source Chinese model
- **Grok**: X's AI model

### Configuration Steps

1. **Open CC Switch**: Launch `cc-switch.exe` from desktop
2. **Select Group**: Choose "Claude" in the group selection
3. **Choose Provider**: Select desired provider (e.g., "PakcyCode" for official models)
4. **Configure API**: Enter API keys for selected models
5. **Test Connection**: Verify model connectivity

### Benefits of CC Switch

- **Cost Optimization**: Chinese models can reduce costs to 1/10 of official models
- **Network Stability**: Bypass geographical restrictions and network issues
- **Quick Switching**: One-click model switching without reconfiguration
- **Multi-Model Support**: Seamless integration with multiple AI providers

## Usage Examples

### Starting Claude Code
```powershell
# Interactive mode
.\claude.exe

# Non-interactive mode
.\claude.exe -p "Your question here"

# Continue previous conversation
.\claude.exe --continue
```

### Using CC Switch
1. Launch CC Switch GUI
2. Select desired model
3. Configure API settings
4. Use Claude Code normally - it will use the selected model

## Troubleshooting

### Claude Code Not Found
**Problem**: `claude : 无法将"claude"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

**Solution**: 
- Restart terminal after installation
- Use full path: `.\claude.exe`
- Check PATH environment variable

### Git Bash Not Found
**Problem**: `Claude Code on Windows requires git-bash`

**Solution**:
```powershell
# Install Git
winget install Git.Git

# Set environment variable
[Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'C:\Program Files\Git\bin\bash.exe', 'User')

# Restart terminal
```

### CC Switch Won't Start
**Problem**: Application doesn't launch or crashes

**Solution**:
- Check if file is blocked by Windows: Right-click → Properties → Unblock
- Run as Administrator
- Check Windows Defender settings
- Verify .NET Framework is installed

### Network Issues
**Problem**: Cannot download from GitHub or access Claude API

**Solution**:
- Enable VPN connection
- Check firewall settings
- Try alternative download sources
- Use portable versions

## Advanced Configuration

### MCP (Model Context Protocol) Setup
CC Switch supports MCP for extending Claude Code capabilities:

1. Open CC Switch settings
2. Navigate to MCP configuration
3. Add MCP servers (e.g., Google Drive, Figma, Slack)
4. Configure authentication
5. Test MCP connections

### Custom Model Configuration
For custom or self-hosted models:

1. Open CC Switch
2. Select "Custom" provider
3. Enter API endpoint
4. Configure authentication
5. Set model parameters

## Verification Checklist

- [ ] Claude Code installed and version verified
- [ ] Git for Windows installed
- [ ] Environment variables configured
- [ ] CC Switch downloaded and extracted
- [ ] CC Switch launches successfully
- [ ] Model configuration tested
- [ ] API keys configured
- [ ] Connection to selected model verified

## Next Steps

1. **Configure API Keys**: Obtain API keys for your chosen models
2. **Test Model Switching**: Try switching between different models in CC Switch
3. **Explore Features**: Test Claude Code capabilities with different models
4. **Set Up MCP**: Configure additional data sources if needed
5. **Customize Settings**: Adjust Claude Code and CC Switch preferences

## Additional Resources

- **Claude Code Documentation**: https://code.claude.com/docs/en/overview
- **CC Switch GitHub**: https://github.com/farion1231/cc-switch
- **Claude API Documentation**: https://docs.anthropic.com/
- **Chinese Model Providers**: Check respective provider documentation for API access

## Tips for Optimal Usage

1. **Start with Chinese Models**: Lower cost, better Chinese language support
2. **Use Official Models for Complex Tasks**: Better reasoning for complex problems
3. **Leverage CC Switch**: Quick model switching based on task complexity
4. **Monitor Usage**: Track API usage and costs
5. **Keep Updated**: Regularly check for updates to both Claude Code and CC Switch

## Common Use Cases

### Code Generation
```powershell
.\claude.exe -p "Create a Python function to calculate Fibonacci numbers"
```

### Debugging
```powershell
.\claude.exe -p "Fix this error: [paste error message]"
```

### Code Explanation
```powershell
.\claude.exe -p "Explain how this code works: [paste code]"
```

### Project Setup
```powershell
.\claude.exe -p "Set up a React project with TypeScript and Tailwind CSS"
```

## Security Best Practices

1. **API Key Protection**: Never commit API keys to version control
2. **Environment Variables**: Use environment variables for sensitive data
3. **Regular Updates**: Keep software updated for security patches
4. **Access Control**: Limit API key permissions
5. **Audit Usage**: Monitor API usage for unusual activity

## Performance Optimization

1. **Model Selection**: Choose appropriate model for task complexity
2. **Workspace Management**: Keep workspaces organized and clean
3. **Cache Management**: Clear cache periodically
4. **Network Optimization**: Use stable internet connection
5. **Resource Management**: Close unnecessary applications during heavy tasks
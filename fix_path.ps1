$claudeDir = (Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "claude.exe" -ErrorAction SilentlyContinue | Select-Object -First 1).DirectoryName
if ($claudeDir) {
    $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($currentPath -notlike "*$claudeDir*") {
        $newPath = $currentPath + ";" + $claudeDir
        [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        Write-Host "Success: Added $claudeDir to Path"
    } else {
        Write-Host "Info: Path already exists"
    }
} else {
    Write-Host "Error: Claude directory not found"
}

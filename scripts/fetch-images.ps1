# Requires: PowerShell 5+
# Purpose: Fetch local images for LP (hero/before/after) from Unsplash Source and save multiple sizes as JPEG.
# Note: Unsplash Source returns random images per query. For stable assets, replace query URLs with fixed photo URLs from Unsplash.

param(
  [string]$OutDir = "assets/images"
)

$ErrorActionPreference = 'Stop'

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

function Get-FinalUrl([string]$url, [string]$tmpPath) {
  try {
    $resp = Invoke-WebRequest -Uri $url -OutFile $tmpPath -MaximumRedirection 5 -TimeoutSec 60
    return $resp.BaseResponse.ResponseUri.AbsoluteUri
  } finally {
    if (Test-Path $tmpPath) { Remove-Item $tmpPath -ErrorAction SilentlyContinue }
  }
}

function Add-Params([string]$base, [string]$params){ if($base -match '\?'){ return "$base&$params" } else { return "$base?$params" } }
function Build-Url([string]$base, [int]$w, [int]$h){ return (Add-Params $base ("fm=jpg&q=85&fit=crop&w=$w&h=$h")) }

$heroQuery   = 'https://source.unsplash.com/1600x900/?beauty,salon,interior,minimal'
$beforeQuery = 'https://source.unsplash.com/1200x800/?eyebrow,closeup,beauty,face'
$afterQuery  = 'https://source.unsplash.com/1200x800/?eyebrow,styling,beauty,face'

Write-Host '[1/3] Resolving final URLs...'
$heroBase   = Get-FinalUrl $heroQuery   (Join-Path $OutDir '.tmp-hero.jpg')
$beforeBase = Get-FinalUrl $beforeQuery (Join-Path $OutDir '.tmp-before.jpg')
$afterBase  = Get-FinalUrl $afterQuery  (Join-Path $OutDir '.tmp-after.jpg')

Write-Host '[2/3] Downloading JPEG sizes...'
$heroSizes = 480,768,1080,1440,1920
foreach($w in $heroSizes){ $h = [math]::Round($w*9/16); $u = Build-Url $heroBase $w $h; Invoke-WebRequest -Uri $u -OutFile (Join-Path $OutDir ("hero-w$w.jpg")) }

$beforeSizes = 480,768,1080
foreach($w in $beforeSizes){ $h = [math]::Round($w*2/3); $u = Build-Url $beforeBase $w $h; Invoke-WebRequest -Uri $u -OutFile (Join-Path $OutDir ("before-w$w.jpg")) }

$afterSizes = 480,768,1080
foreach($w in $afterSizes){ $h = [math]::Round($w*2/3); $u = Build-Url $afterBase $w $h; Invoke-WebRequest -Uri $u -OutFile (Join-Path $OutDir ("after-w$w.jpg")) }

Write-Host '[3/3] Writing attribution...'
$attrib = @{ hero = @{ base = $heroBase; query = $heroQuery; sizes = $heroSizes }; before = @{ base = $beforeBase; query = $beforeQuery; sizes = $beforeSizes }; after = @{ base = $afterBase; query = $afterQuery; sizes = $afterSizes } }
$attrib | ConvertTo-Json -Depth 4 | Out-File 'docs/attribution.json' -Encoding UTF8

Write-Host 'Done. Saved to' $OutDir

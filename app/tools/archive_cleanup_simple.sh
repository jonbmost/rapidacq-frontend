#!/bin/bash

# RapidAcq Repository Cleanup Script - Run from tools directory
# Navigate to your app/tools directory first, then run this script

echo "==================================================="
echo "RapidAcq Repository Cleanup - Archive Mode"
echo "==================================================="
echo ""

# Get current directory
CURRENT_DIR=$(pwd)

echo "Current directory: $CURRENT_DIR"
echo ""

# Check if we're in the right place by looking for some expected folders
if [ ! -d "acquisition-strategy" ] && [ ! -d "market-analysis" ]; then
    echo "⚠️  Warning: This doesn't look like the tools directory."
    echo "   Expected to find folders like 'acquisition-strategy' or 'market-analysis'"
    echo ""
    read -p "Continue anyway? (yes/no): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        echo "Cancelled. Please navigate to your app/tools directory first."
        exit 0
    fi
fi

# Create archive directory
ARCHIVE_DIR="${CURRENT_DIR}/_archived_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$ARCHIVE_DIR"

echo "Archive directory will be: $ARCHIVE_DIR"
echo ""

# Folders to archive (don't match the 10 services)
FOLDERS_TO_ARCHIVE=(
    "agile-planner"
    "contract-review"
    "far-compliance"
    "market-research"
    "pm-cor-coordinator"
    "rfp-generator"
    "sbir-transition"
    "sow-generator"
    "strategy-advisor"
)

echo "The following folders will be archived:"
FOUND_COUNT=0
for folder in "${FOLDERS_TO_ARCHIVE[@]}"; do
    if [ -d "$folder" ]; then
        echo "  ✓ $folder (found)"
        FOUND_COUNT=$((FOUND_COUNT + 1))
    else
        echo "  ✗ $folder (not found - will skip)"
    fi
done

echo ""
echo "Found $FOUND_COUNT folders to archive."
echo ""

if [ $FOUND_COUNT -eq 0 ]; then
    echo "No folders found to archive. Exiting."
    exit 0
fi

read -p "Proceed with archiving? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

# Archive each folder
echo ""
echo "Archiving folders..."
ARCHIVED_COUNT=0

for folder in "${FOLDERS_TO_ARCHIVE[@]}"; do
    if [ -d "$folder" ]; then
        echo "  Moving $folder..."
        mv "$folder" "$ARCHIVE_DIR/"
        ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
    fi
done

echo ""
echo "==================================================="
echo "Cleanup Complete!"
echo "==================================================="
echo "Archived $ARCHIVED_COUNT folders to:"
echo "$ARCHIVE_DIR"
echo ""
echo "Remaining folders:"
ls -1 | grep -v "_archived"
echo ""
echo "✅ Your repository now has only the 10 service folders!"
echo ""
echo "If you need to restore anything, the archived folders are in:"
echo "$ARCHIVE_DIR"

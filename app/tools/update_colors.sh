#!/bin/bash

# Script to update all service page colors to match Acquisition Strategy

echo "==================================================="
echo "RapidAcq Color Theme Update"
echo "==================================================="
echo ""
echo "This will update all service pages to use the blue theme"
echo "matching the Acquisition Strategy page."
echo ""

# List of services to update (excluding acquisition-strategy which is already correct)
SERVICES=(
    "authority-assessment"
    "document-analysis"
    "evaluation-criteria"
    "market-analysis"
    "regs-policy"
    "requirement-documents"
    "slide-ranger"
    "sop-creation"
    "stakeholder-mapping"
)

echo "Services to update:"
for service in "${SERVICES[@]}"; do
    echo "  - $service"
done
echo ""

read -p "Proceed with color updates? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo "Updating colors..."
echo ""

# Color replacements - USWDS to new theme
for service in "${SERVICES[@]}"; do
    FILE="$service/page.tsx"
    
    if [ ! -f "$FILE" ]; then
        echo "⚠️  Skipping $service - page.tsx not found"
        continue
    fi
    
    echo "Updating $service..."
    
    # Background colors
    sed -i '' 's/bg-uswds-gray-5/bg-[#0f172a]/g' "$FILE"
    sed -i '' 's/bg-uswds-gold/bg-[#1e293b]/g' "$FILE"
    sed -i '' 's/bg-white/bg-slate-800\/50/g' "$FILE"
    sed -i '' 's/bg-gray-50/bg-slate-800\/50/g' "$FILE"
    sed -i '' 's/bg-uswds-gray-90/bg-[#1e293b]/g' "$FILE"
    sed -i '' 's/bg-slate-900/bg-slate-800\/50/g' "$FILE"
    
    # Border colors
    sed -i '' 's/border-uswds-gray-30/border-slate-700/g' "$FILE"
    sed -i '' 's/border-gray-200/border-slate-700/g' "$FILE"
    sed -i '' 's/border-uswds-gold/border-slate-700/g' "$FILE"
    
    # Text colors
    sed -i '' 's/text-uswds-gray-90/text-white/g' "$FILE"
    sed -i '' 's/text-uswds-gray-70/text-slate-400/g' "$FILE"
    sed -i '' 's/text-gray-600/text-slate-400/g' "$FILE"
    sed -i '' 's/text-gray-900/text-white/g' "$FILE"
    sed -i '' 's/text-uswds-gold/text-blue-500/g' "$FILE"
    sed -i '' 's/text-gold-100/text-slate-400/g' "$FILE"
    
    # Accent/button colors
    sed -i '' 's/bg-uswds-gold\/10/bg-blue-600\/10/g' "$FILE"
    sed -i '' 's/hover:bg-uswds-gold/hover:bg-blue-700/g' "$FILE"
    sed -i '' 's/focus:ring-uswds-gold/focus:ring-blue-500/g' "$FILE"
    
    # User message bubbles
    sed -i '' 's/bg-uswds-gold text-white/bg-blue-600 text-white/g' "$FILE"
    
    # Assistant message bubbles
    sed -i '' "s/bg-white text-gray-900 border border-gray-200/bg-slate-900\/50 text-slate-100 border border-slate-700/g" "$FILE"
    
    # Input fields
    sed -i '' 's/bg-white border-gray-300/bg-slate-800 border-slate-700/g' "$FILE"
    sed -i '' 's/placeholder-gray-500/placeholder-slate-500/g' "$FILE"
    
    # Hover states for links
    sed -i '' 's/text-white\/80 hover:text-white/text-slate-400 hover:text-white/g' "$FILE"
    sed -i '' 's/hover:text-uswds-gold/hover:text-white/g' "$FILE"
    
    echo "  ✓ Updated $service"
done

echo ""
echo "==================================================="
echo "Color Update Complete!"
echo "==================================================="
echo ""
echo "All services now use the blue theme matching Acquisition Strategy."
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff"
echo "2. Test a few services to verify colors look correct"
echo "3. Commit: git add . && git commit -m 'Update all service colors to match blue theme'"
echo "4. Push: git push"

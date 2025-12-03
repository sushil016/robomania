# 🧪 Registration Flow - Quick Testing Guide

## 🎯 Purpose
This guide helps you quickly test all the new Phase 3 accessibility features (and verify Phase 1 & 2 still work).

---

## ⚡ Quick Smoke Test (5 minutes)

### 1. Basic Flow
```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:3000/team-register
```

**Test:**
- ✅ Page loads without errors
- ✅ Step indicator shows (1 of 4)
- ✅ Competition cards are visible
- ✅ "Tip: Use arrow keys" message appears

---

## ⌨️ Keyboard Navigation Test (3 minutes)

### Test Arrow Key Navigation:
1. Load registration page
2. Select a competition (click)
3. Press **Right Arrow (→)** key
   - ✅ Should move to Step 2 (Team Details)
4. Press **Left Arrow (←)** key
   - ✅ Should move back to Step 1
5. Press **Right Arrow** again (move to Step 2)
6. Press **Right Arrow** without filling form
   - ✅ Should show validation errors
   - ✅ Should NOT advance to Step 3

### Test Escape Key:
1. On Step 1, click "Preview" on a competition card
2. Modal should open with competition details
3. Press **Escape** key
   - ✅ Modal should close

### Test Tab Navigation:
1. Press **Tab** key multiple times
2. Verify:
   - ✅ Focus visible on all elements
   - ✅ Focus order is logical (top to bottom)
   - ✅ Can reach all interactive elements

**Expected Behavior:**
- Arrow keys work when NOT typing in inputs
- Escape closes all modals
- Tab order is intuitive
- Keyboard hint is visible in header

---

## 🔊 Screen Reader Test (5 minutes)

### macOS (VoiceOver):
```bash
# Enable VoiceOver
Cmd + F5

# Navigate
Ctrl + Option + → (next item)
Ctrl + Option + ← (previous item)
```

### What to Test:
1. **Step Navigation:**
   - Move from Step 1 → Step 2
   - Listen for: "Moved to step 2: Team Details"
   
2. **Validation Errors:**
   - Try to advance without selecting competition
   - Listen for: "Validation failed. Please check the form for errors."

3. **Form Labels:**
   - Tab to each input field
   - Verify each field has a descriptive label read out

**Expected Announcements:**
- "Moved to step X: [Step Name]"
- "Validation failed. Please check the form for errors."
- "Editing step X: [Step Name]"

---

## 🎬 Reduced Motion Test (2 minutes)

### macOS:
```
System Settings → Accessibility → Display → Reduce Motion → ON
```

### Windows:
```
Settings → Ease of Access → Display → Show animations → OFF
```

### What to Test:
1. Reload the registration page
2. Navigate between steps
3. Verify:
   - ✅ No slide animations (instant transitions)
   - ✅ Scrolling is instant (not smooth)
   - ✅ Page is fully functional
   - ✅ Tooltips still fade (allowed)

**Expected Behavior:**
- Steps change instantly (no slide animation)
- Scroll to top is instant
- Everything else works normally

---

## 💡 Tooltip Test (3 minutes)

### Mouse Interaction:
1. Go to Step 3 (Robot Details)
2. **Hover** over the ℹ️ icon next to "Weight (kg)"
   - ✅ Tooltip appears with helpful text
3. Move mouse away
   - ✅ Tooltip disappears

### Keyboard Interaction:
1. **Tab** to the ℹ️ icon
2. It should get focus (outline visible)
3. Tooltip appears automatically
4. Press **Escape**
   - ✅ Tooltip disappears

### Where to Find Tooltips:
- **Step 1 (Competitions):**
  - Max Weight info
  - Team Size info
  - Prize Pool info

- **Step 3 (Robot Details):**
  - Weight field
  - Dimensions field
  - Weapon Type field (RoboWars only)

**Expected Behavior:**
- Tooltips appear on hover
- Tooltips appear on keyboard focus
- Escape closes tooltips
- Content is helpful and clear

---

## 🎨 Animation Test (Phase 2)

### What to Test:
1. Navigate through all 4 steps
2. Verify:
   - ✅ Smooth slide animation between steps
   - ✅ Spring physics feels natural
   - ✅ Direction changes (forward vs backward)

3. Complete registration
   - ✅ Confetti animation plays
   - ✅ Success modal appears
   - ✅ Auto-redirect after 3 seconds

**Expected Behavior:**
- Forward: Slides in from right
- Backward: Slides in from left
- Smooth spring physics
- Confetti on success

---

## 💾 Auto-save Test (Phase 1)

### What to Test:
1. Start registration (don't complete)
2. Fill in some fields (Team Name, etc.)
3. Wait 30 seconds
4. Look for: "Draft saved automatically" message
5. Refresh the page (F5)
6. Verify:
   - ✅ "Resume Previous Registration?" prompt appears
   - ✅ Click "Load Draft" restores your data

**Expected Behavior:**
- Auto-saves every 30 seconds
- Shows green save indicator
- Draft persists across page reloads
- Can discard draft

---

## ✅ Validation Test (Phase 1)

### What to Test:

**Email Validation:**
1. Go to Step 2 (Team Details)
2. Enter invalid email: `test@` (incomplete)
3. Tab away from field
   - ✅ Red error: "Please enter a valid email"

**Phone Validation:**
1. Enter invalid phone: `123` (too short)
2. Tab away
   - ✅ Error: "Phone number must be 10 digits"

**Weight Validation:**
1. Go to Step 3 (Robot Details)
2. For RoboWars, enter weight: `10` (over 8kg limit)
3. See warning: "Weight exceeds maximum"

**Real-time Validation:**
- Errors appear as you type
- Errors clear when fixed
- Clear feedback with icons

---

## 🚀 Quick Full Flow Test (5 minutes)

### Complete Registration:
1. **Step 1:** Select "RoboWars"
2. Press **→** (arrow key)
3. **Step 2:** Fill team details
   - Team Name: "Test Team"
   - Leader Name: "John Doe"
   - Leader Email: "john@iitd.ac.in" (watch auto-fill!)
   - Leader Phone: "9876543210"
   - Institution: Should auto-fill "IIT Delhi"
4. Press **→**
5. **Step 3:** Fill robot details
   - Robot Name: "Destroyer"
   - Weight: 7.5
   - Dimensions: "60x60x60"
   - Weapon: "Hammer"
6. Hover over **weight field ℹ️ icon**
   - ✅ Tooltip appears
7. Press **→**
8. **Step 4:** Review everything
9. Select "Pay Now"
10. See confetti! 🎉

**Expected Results:**
- ✅ Keyboard navigation works throughout
- ✅ Tooltips appear on hover
- ✅ Auto-save indicator shows
- ✅ Validation prevents errors
- ✅ Auto-fill suggests IIT Delhi
- ✅ Success celebration plays

---

## 🎯 Critical Checks

### Must Work:
- [ ] No console errors
- [ ] All components render
- [ ] Keyboard navigation (arrows, Escape, Tab)
- [ ] Screen reader announcements (test with VoiceOver)
- [ ] Reduced motion respected
- [ ] Tooltips appear and close
- [ ] Auto-save works
- [ ] Validation is real-time
- [ ] Animations are smooth
- [ ] Mobile responsive (test on phone)

### Known Issues:
- None! All phases implemented with zero errors 🎉

---

## 📱 Mobile Testing (3 minutes)

### Open on Phone:
```
# Get your local IP
# On Mac: ifconfig | grep "inet "
# On Windows: ipconfig

# Visit on phone: http://YOUR_IP:3000/team-register
```

### What to Test:
1. Touch targets are large enough (44px minimum)
2. Competition cards are tappable
3. Forms are easy to fill
4. Tooltips work on tap
5. Animations are smooth
6. Everything fits on screen

---

## 🐛 Debug Mode

### If Something Doesn't Work:

**Check Console:**
```javascript
// Open browser console (F12)
// Look for errors in red
```

**Check Network:**
```
// Open Network tab
// Verify all files loaded
// Check for 404 errors
```

**Verify Imports:**
```typescript
// All these should exist:
import { Tooltip } from '@/components/Tooltip'
import { Skeleton } from '@/components/Skeleton'
import { announceToScreenReader } from '@/lib/accessibility'
```

---

## ✅ Success Criteria

Your implementation is working if:

1. **Keyboard Navigation:**
   - ✅ Arrow keys navigate steps
   - ✅ Escape closes modals
   - ✅ Tab reaches all elements

2. **Screen Reader:**
   - ✅ Step changes announced
   - ✅ Errors announced
   - ✅ All fields labeled

3. **Reduced Motion:**
   - ✅ Animations disabled when requested
   - ✅ Page still functional

4. **Tooltips:**
   - ✅ Appear on hover
   - ✅ Appear on focus
   - ✅ Close on Escape

5. **Auto-save:**
   - ✅ Saves every 30 seconds
   - ✅ Restores on reload

6. **Validation:**
   - ✅ Real-time feedback
   - ✅ Clear error messages

7. **Animations:**
   - ✅ Smooth transitions
   - ✅ Confetti celebration

---

## 🎊 All Tests Passed?

**Congratulations!** 🎉

You now have a:
- ♿ Fully accessible
- ⚡ Lightning fast
- 🎨 Beautiful
- 📱 Mobile-optimized
- 🧩 Well-architected

...registration flow!

---

## 📝 Report Issues

If you find any bugs:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Verify you're on latest code
4. Check that all files were created
5. Ensure npm packages installed:
   ```bash
   npm install framer-motion canvas-confetti @types/canvas-confetti
   ```

---

**Happy Testing! 🚀**

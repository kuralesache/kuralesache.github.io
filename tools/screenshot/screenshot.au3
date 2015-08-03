#include <GUIConstants.au3>
#include <ScreenCapture.au3>

Const $WIDTH = @DesktopWidth - 100
Const $HEIGHT = 30
Const $X = -1
Const $Y = @DesktopHeight - $HEIGHT - 30
Const $COLOR = "0xFFFF00"
Const $FONT_FAMILY = "Microsoft Sans Serif"
Const $TITLE = "Save Info"
Const $ANSI_CHARSET = 0
Const $OUT_CHARACTER_PRECIS = 2
Const $CLIP_DEFAULT_PRECIS = 0
Const $PROOF_QUALITY = 2
Const $FIXED_PITCH = 1

Const $GUI = GUICreate($TITLE, $WIDTH, $HEIGHT, $X, $Y, $WS_POPUPWINDOW, BitOR($WS_EX_APPWINDOW, $WS_EX_TOPMOST))
Const $hDC = DllCall("user32.dll", "int", "GetDC", "hwnd", $GUI)
Const $font = DllCall("gdi32.dll", "hwnd", "CreateFont", "int", $height, "int", 0, "int", 0, "int", 0, "int", 0, "int", 0, "int", 0, "int", 0, "int", $ANSI_CHARSET, "int", $OUT_CHARACTER_PRECIS, "int", $CLIP_DEFAULT_PRECIS, "int", $PROOF_QUALITY, "int", $FIXED_PITCH, "str", $FONT_FAMILY)
GUISetBkColor($COLOR)
GUISetState(@SW_SHOW)

;#NoTrayIcon
opt("GUIOnEventMode", 1)
opt("MustDeclareVars", 1)

Dim $frame
Dim $path
Dim $capture_window

LoadSettings()

HotKeySet("!+^l", "LoadSettings")
HotKeySet("!+^s", "Screenshot")
HotKeySet("!+^q", "OnExit")
HotKeySet("!+^w", "SetCaptureWindow")

Do
   Sleep(100)
Until 0

Func Screenshot()
   Local $file_path = $path & $frame & ".png"
   _ScreenCapture_CaptureWnd($file_path, $capture_window)
   WriteText("Wrote file: " & $file_path)
   $frame += 1
EndFunc

Func SetCaptureWindow()
   $capture_window = WinWaitActive("")
   WriteText("Set currently active window as capture window.")
EndFunc

Func LoadSettings()
   $frame = Int(IniRead("settings.ini", "Settings", "first_frame", "<path>"))
   $path = IniRead("settings.ini", "Settings", "path", "<path>")
   DirCreate($path)
   WriteText("Settings loaded. First frame: " & $frame & " | Path: " & $path)
EndFunc

Func WriteText($text)
   DllCall("gdi32.dll", "hwnd", "SelectObject", "int", $hDC[0], "hwnd", $font[0])
   DllCall("gdi32.dll", "int", "BeginPath", "int", $hDC[0])
   DllCall("gdi32.dll", "int", "TextOut", "int", $hDC[0], "int", 0, "int", 0, "str", $text, "int", StringLen($text))
   DllCall("gdi32.dll", "int", "EndPath", "int", $hDC[0])
   Dim $hRgn1 = DllCall("gdi32.dll", "hwnd", "PathToRegion", "int", $hDC[0])
   Dim $rc = DllStructCreate("int;int;int;int")
   DllCall("gdi32.dll", "int", "GetRgnBox", "hwnd", $hRgn1[0], "ptr", DllStructGetPtr($rc))
   Dim $hRgn2 = DllCall("gdi32.dll", "hwnd", "CreateRectRgnIndirect", "ptr", DllStructGetPtr($rc))
   DllCall("gdi32.dll", "int", "CombineRgn", "hwnd", $hRgn2[0], "hwnd", $hRgn2[0], "hwnd", $hRgn1[0], "int", 3)
   DllCall("gdi32.dll", "int", "DeleteObject", "hwnd", $hRgn1[0])
   DllCall("user32.dll", "int", "ReleaseDC", "hwnd", $GUI, "int", $hDC[0])
   DllCall("user32.dll", "int", "SetWindowRgn", "hwnd", $GUI, "hwnd", $hRgn2[0], "int", 1)
EndFunc

Func OnExit()
   Exit
EndFunc
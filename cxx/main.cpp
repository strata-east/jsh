#include <windows.h>
#include <exdisp.h>
#include <shlguid.h>
#include <mshtml.h>
#include <oleacc.h>
#include <servprov.h>
#include <tchar.h>
#include <cstdlib>
#include <cstdio>
#include <cstring>

#include "resources.rc"

class CComString: public VARIANT
{
public:
  CComString()
  {
    ::VariantClear(this);
  }
  CComString(const char* s, size_t len)
  {
    init(s, len);
  }
  CComString(const char* s)
  {
    init(s, strlen(s));
  }
  CComString(const wchar_t* s)
  {
    this->vt = VT_BSTR;
    this->bstrVal = SysAllocString(s);
  }
  ~CComString()
  {
    ::VariantClear(this);
  }
private:
  void init(const char* s, size_t len)
  {
    this->vt = VT_BSTR;
    wchar_t* ws = new wchar_t[len + 1];
    ws[len] = L'\0';
    MultiByteToWideChar(CP_ACP, MB_PRECOMPOSED, s, len, ws, len);
    this->bstrVal = SysAllocString(ws);
    free(ws);
  }
};

CComString* pScript;

void ForceSetForegroundWindow(HWND hWnd)
{
  hWnd = GetAncestor(hWnd, GA_ROOT);
  if(IsIconic(hWnd))
    ShowWindow(hWnd, SW_RESTORE);
  DWORD thisThreadId = GetCurrentThreadId();
  DWORD foregroundThreadId = GetWindowThreadProcessId(GetForegroundWindow(), NULL);
  AttachThreadInput(thisThreadId, foregroundThreadId, TRUE);
  BringWindowToTop(hWnd);
  SetForegroundWindow(hWnd);
  AttachThreadInput(thisThreadId, foregroundThreadId, FALSE);
}

IWebBrowser2* WindowToBrowser(IHTMLWindow2* pWnd)
{
  HRESULT hr;
  IWebBrowser2* pWebBrowser2 = NULL;
  IServiceProvider* pServiceProvider = NULL;
  hr = pWnd->QueryInterface(IID_IServiceProvider, reinterpret_cast<LPVOID*>(&pServiceProvider));
  if(SUCCEEDED(hr))
  {
    hr = pServiceProvider->QueryService(IID_IWebBrowserApp, IID_IWebBrowser2, reinterpret_cast<LPVOID*>(&pWebBrowser2));
    if(FAILED(hr))
    {
      printf("      FAILED: IServiceProvider[%p]->QS(IWebBrowser2)\n", pServiceProvider);
    }
    pServiceProvider->Release();
  }
  return pWebBrowser2;
}

IHTMLDocument2* HwndToDocument(HWND hWnd)
{
  IHTMLDocument2* pHTMLDocument2 = NULL;
  LRESULT lResult = 0;
  SendMessageTimeout(hWnd, RegisterWindowMessage(_T("WM_HTML_GETOBJECT")), 0, 0, SMTO_ABORTIFHUNG, 1000, reinterpret_cast<PDWORD_PTR>(&lResult));
  ObjectFromLresult(lResult, IID_IHTMLDocument2, 0, reinterpret_cast<void**>(&pHTMLDocument2));
  return pHTMLDocument2;
}

void DocumentHandler(IHTMLDocument2* pHTMLDocument2)
{
  printf("  IHTMLDocument2[%p]", pHTMLDocument2);
  // Domain
  BSTR bstrDomain = NULL;
  if(SUCCEEDED(pHTMLDocument2->get_domain(&bstrDomain)))
  {
    LPSTR szDomain = static_cast<LPSTR>(malloc(SysStringLen(bstrDomain) + 1));
    WideCharToMultiByte(CP_ACP, WC_COMPOSITECHECK, bstrDomain, -1, szDomain, SysStringLen(bstrDomain) + 1, NULL, FALSE);
    SysFreeString(bstrDomain);
    printf(" domain[%s]", szDomain);
    free(szDomain);
  }
  printf("\n");

  // IHTMLDocument2 -> IHTMLWindow2
  IHTMLWindow2* pHtmlWindow = NULL;
  pHTMLDocument2->get_parentWindow(&pHtmlWindow);
  if(pHtmlWindow)
  {
    printf("    IHtmlWindow2[%p]\n", pHtmlWindow);

    // IHTMLWindow2 -> IWebBrowser2
    IWebBrowser2* pWebBrowser2 = WindowToBrowser(pHtmlWindow);
    if(pWebBrowser2)
    {
      printf("    IWebBrowser2[%p]", pWebBrowser2);
      HWND hWnd = NULL;
      if(SUCCEEDED(pWebBrowser2->get_HWND(reinterpret_cast<long*>(&hWnd))))
        printf(", HWND[%p]", hWnd);
      BSTR bstrLocationURL = NULL;
      if(SUCCEEDED(pWebBrowser2->get_LocationURL(&bstrLocationURL)))
      {
        LPSTR szLocationURL = static_cast<LPSTR>(malloc(SysStringLen(bstrLocationURL) + 1));
        WideCharToMultiByte(CP_ACP, WC_COMPOSITECHECK, bstrLocationURL, -1, szLocationURL, SysStringLen(bstrLocationURL) + 1, NULL, FALSE);
        SysFreeString(bstrLocationURL);
        printf(" URL[%s]", szLocationURL);
        free(szLocationURL);
      }
      printf("\n");
      pWebBrowser2->Release();
    }
    // pHtmlWindow will be released later
  }

  // IHTMLDocument2 -> IHTMLFramesCollection2
  IHTMLFramesCollection2* pHTMLFramesCollection2 = NULL;
  pHTMLDocument2->get_frames(reinterpret_cast<IHTMLFramesCollection**>(&pHTMLFramesCollection2));
  if(pHTMLFramesCollection2)
  {
    long iFrameNumber = 0;
    pHTMLFramesCollection2->get_length(&iFrameNumber);
    pHTMLFramesCollection2->Release();
    if(iFrameNumber)
    {
      IOleContainer* pOleContainer = NULL;
      pHTMLDocument2->QueryInterface(IID_IOleContainer, reinterpret_cast<void**>(&pOleContainer));
      if(pOleContainer)
      {
        IEnumUnknown* pEnumUnknown;
        pOleContainer->EnumObjects(1 /*OLECONTF_EMBEDDINGS*/, &pEnumUnknown);
        IUnknown* pUnknown;
        ULONG uFetched;
        for(unsigned int i = 0; pEnumUnknown->Next(1, &pUnknown, &uFetched) == S_OK; i++)
        {
          IWebBrowser2* pBrowser = NULL;
          pUnknown->QueryInterface(IID_IWebBrowser2, reinterpret_cast<void**>(&pBrowser));
          if(pBrowser)
          {
            IDispatch* pDispatch = NULL;
            pBrowser->get_Document(&pDispatch);
            if(pDispatch)
            {
              IHTMLDocument2* pHTMLDocument2 = NULL;
              pDispatch->QueryInterface(IID_IHTMLDocument2, reinterpret_cast<void**>(&pHTMLDocument2));
              if(pHTMLDocument2)
              {
                DocumentHandler(pHTMLDocument2);
                pHTMLDocument2->Release();
              }
              pDispatch->Release();
            }
            pBrowser->Release();
          }
          else
          {
            printf("      FAILED: IUnknown[%p]->QI(IWebBrowser2)\n", pUnknown);
          }
          pUnknown->Release();
        }
        pEnumUnknown->Release();          
        pOleContainer->Release();
      }
    }
  }

  if(pHtmlWindow)
  {
    VARIANT retval;
    retval.vt = VT_EMPTY;
    CComString language("JavaScript");
    pHtmlWindow->execScript(pScript->bstrVal, language.bstrVal, &retval);
    pHtmlWindow->Release();
  }
}

void WindowHandler(HWND hWnd)
{
  char windowText[256] = "";
  GetWindowTextA(GetAncestor(hWnd, GA_ROOT), windowText, 256);
  printf("HWND[%p] -> ROOT[%p] [%s]\n", hWnd, GetAncestor(hWnd, GA_ROOT), windowText);
  ForceSetForegroundWindow(hWnd);
  IHTMLDocument2* pHTMLDocument2 = NULL;
  pHTMLDocument2 = HwndToDocument(hWnd);
  if(pHTMLDocument2)
  {
    DocumentHandler(pHTMLDocument2);
    pHTMLDocument2->Release();
  }
}

BOOL CALLBACK EnumWindowsProc(HWND hWnd, LPARAM lParam)
{
  const size_t bufsize = 32;
  char s[bufsize] = "";
  GetClassNameA(hWnd, s, bufsize);
  if(IsWindowVisible(hWnd) && !strcmp(s, "Internet Explorer_Server"))
    WindowHandler(hWnd);
  if(!(GetWindowLongA(hWnd, GWL_STYLE) & WS_CHILD) || GetParent(hWnd) == GetDesktopWindow())
    EnumChildWindows(hWnd, EnumWindowsProc, 0);
  return TRUE;
}

#ifdef __GNUC__
#ifdef _UNICODE
#undef _tmain
#define _tmain wmain
extern "C" void __wgetmainargs(int*, wchar_t***, wchar_t***, int, void**);
int wmain(int, wchar_t*[]);
int main()
{
	int _Argc;
	wchar_t **_Argv;
	wchar_t **_Env;
	void* _StartInfo = NULL;
	__wgetmainargs(&_Argc, &_Argv, &_Env, 0, &_StartInfo);
	return wmain(_Argc, _Argv);
}
#else
#define _tmain main
#endif
#endif

int _tmain(int argc, TCHAR *argv[])
{
  int retval = EXIT_FAILURE;
  if(argc > 1)
  {
    HANDLE hFile = CreateFile(argv[1], GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_READONLY, NULL);
    if(hFile != INVALID_HANDLE_VALUE)
    {
      DWORD dwFileSize = GetFileSize(hFile, NULL);
      if(dwFileSize != INVALID_FILE_SIZE)
      {
        HANDLE hFileMapping = CreateFileMapping(hFile, NULL, PAGE_READONLY, 0, 0, NULL);
        if(hFileMapping)
        {
          LPVOID pMappedView = MapViewOfFile(hFileMapping, FILE_MAP_READ, 0, 0, 0);
          pScript = new CComString(static_cast<char*>(pMappedView), dwFileSize);
          UnmapViewOfFile(pMappedView);
          CloseHandle(hFileMapping);
        }
      }
    }
  }
  else
  {
    HMODULE hModule = GetModuleHandle(NULL);
    HRSRC hRsrc = FindResource(hModule, "JAVASCRIPT", RT_RCDATA);
    if(hRsrc)
    {
      DWORD dwFileSize = SizeofResource(hModule, hRsrc);
      HGLOBAL hResource = LoadResource(hModule, hRsrc);
      pScript = new CComString(static_cast<char*>(LockResource(hResource)), dwFileSize);
      FreeResource(hResource);
    }
  }
  if(pScript)
  {
    HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED);
    if(SUCCEEDED(hr))
    {
      EnumWindows(EnumWindowsProc, 0);
      CoUninitialize();
      retval = EXIT_SUCCESS;
    }
  }
  delete pScript;
  return retval;
}

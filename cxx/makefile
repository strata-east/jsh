CFLAGS = -s -Os
LIBS = -lkernel32 -luser32 -lole32 -luuid -loleacc -loleaut32 -lstdc++

main.exe : makefile main.cpp resources.o
	$(CC) $(CFLAGS) -o main.exe main.cpp resources.o $(LIBS)

resources.o : makefile resources.rc resource.js
	windres -o resources.o resources.rc

resource.js : makefile ../lib/Tartarus.js ../lib/Prelude.js ../lib/Intermezzo.js ../lib/URI.js ../JSH.js
	cat ../lib/Tartarus.js > resource.js
	cat ../lib/Prelude.js >> resource.js
	cat ../lib/Intermezzo.js >> resource.js
	cat ../lib/URI.js >> resource.js
	cat ../JSH.js >> resource.js

clean :
	$(RM) main.exe resources.o

.PHONY : clean

package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Printf("%s/%s\n", runtime.GOOS, runtime.GOARCH)
}

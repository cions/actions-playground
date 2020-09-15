cmake_minimum_required(VERSION 3.10)

project(HelloWorld VERSION 1.0.0 LANGUAGES C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(hello-c hello.c)
add_executable(hello-cpp hello.cpp)

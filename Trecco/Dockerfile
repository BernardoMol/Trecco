# Stage 1 - Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia a solution e os projetos
COPY Trecco.sln ./
COPY ApiTreccoRENDER/*.csproj ./ApiTreccoRENDER/
COPY BibliotecaSUPABASE/*.csproj ./BibliotecaSUPABASE/

# Restaura pacotes
RUN dotnet restore Trecco.sln

# Copia o restante dos arquivos
COPY ApiTreccoRENDER/. ./ApiTreccoRENDER/
COPY BibliotecaSUPABASE/. ./BibliotecaSUPABASE/

# Publica o projeto
WORKDIR /src/ApiTreccoRENDER
RUN dotnet publish -c Release -o /app/publish

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "ApiTreccoRENDER.dll"]

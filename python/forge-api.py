import base64, json, hashlib, os.path, requests, shutil, time, sys, re
import platform
from optparse import OptionParser


BASE_URL = 'https://developer.api.autodesk.com//'
# accept from env
BUCKET_KEY = 'forge_sample3'


def authenticate():
  global BUCKET_KEY

  # apply autodesk forge account for rlb.
  consumer_key = 'PQatiAHERaHbn4Vc6GyA59d2OO31xfgA'
  consumer_secret = 'YqAflNPIIl3JBQAf'

  BUCKET_KEY = (BUCKET_KEY + '_' + consumer_key).lower ()

  # Step 2: Get your access token
  url = BASE_URL + 'authentication/v1/authenticate'

  data = {
    'client_id' : consumer_key,
    'client_secret' : consumer_secret,
    'grant_type' : 'client_credentials',
    'scope' : 'data:read data:write data:create data:search bucket:create bucket:read bucket:update bucket:delete'
  }

  headers = {
    'Content-Type' : 'application/x-www-form-urlencoded',

  }

  r = requests.post(url, data=data, headers=headers)

  content = eval(r.content)

  if 200 != r.status_code:
    print (r.status_code)
    print (r.headers['content-type'])
    print (type(r.content))
    print (content)
 
  if 200 != r.status_code:
    print ("Authentication returned status code %s." % r.status_code)
 
  access_token = content['access_token']

  print('\x1b[6;30;42m' + 'STEP 2' + '\x1b[0m')
  print('Step 2 returns access token', access_token)
  return access_token

  # Step 3: Create a bucket

def createBucket(access_token):

    # Check for prior existence:
    print(BUCKET_KEY)
    url = BASE_URL + 'oss/v2/buckets/' + BUCKET_KEY + '/details'

    headers = {
      'Authorization' : 'Bearer ' + access_token,
    }

    print('\x1b[6;30;42m' + 'STEP 3' + '\x1b[0m')
    print ('Step 3: Check whether bucket exists')
    print ('curl -k -X GET -H "Authorization: Bearer %s" %s' % (access_token, url))

    print (url)
    print (headers)

    r = requests.get(url, headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    print (r.content)

    if 200 != r.status_code:
      print ('CREATING BUCKET !!!!')
      # Create a new bucket:
      url = BASE_URL + 'oss/v2/buckets'

      data = {
        'bucketKey' : BUCKET_KEY,
        'policyKey': 'transient',
      }

      headers = {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + access_token
      }

      print ('Step 3: Create a bucket')
      print ('curl -k -H "Authorization: Bearer %s" -H "Content-Type:application/json" --data "{\\"bucketKey\\":\\"%s\\",\\"policy\\":\\"transient\\"}" %s' % (access_token, BUCKET_KEY, url))

      print (url)
      print (json.dumps(data))
      print (headers)

      r = requests.post(url, data=json.dumps(data), headers=headers)

      if 200 != r.status_code:
        print (r.status_code)
        print (r.headers['content-type'])
        print (r.content)

      if 200 != r.status_code:
        print ("Bucket creation returned status code %s." % r.status_code)

  # Step 4: Upload a file

def uploadModel(access_token, rvtfilename, prefixJson):
    # accept from env

    #rvt_filename = "rvt-models/31289_S_NST_16_Strl _20170719.rvt"
    rvt_filename = rvtfilename

    filesize = os.path.getsize( rvt_filename )
    model_filename = os.path.basename( rvt_filename ).replace(' ', '+')

    url = BASE_URL + 'oss/v2/buckets/' + BUCKET_KEY + '/objects/' + model_filename

    headers = {
      'Content-Type' : 'application/octet-stream',
      'Content-Length' : str(filesize),
      'Authorization' : 'Bearer ' + access_token,
    }

    print('\x1b[6;30;42m' + 'STEP 4' + '\x1b[0m')
    print ("Step 4: starting upload of model file '%s', %s bytes..." % (model_filename,filesize))

    #print ('curl -k -H "Authorization: Bearer %s" -H "Content-Type:application/octet-stream" -T "%s" -X PUT %s' % (access_token, "SMCBuildingmodified.ifc.rvt", url))

    with open(rvt_filename, 'rb') as f:
      r = requests.put(url, headers=headers, data=f)

    print (r.status_code)
    print (r.headers['content-type'])
    print (r.content)

    content = eval(r.content)
    urn = content['objectId']
    print ('id:', urn)

    # import base64
    # base64.b64encode("urn:adsk.objects:os.object:jtbucket/two_columns_rvt")
    # 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6anRidWNrZXQvdHdvX2NvbHVtbnNfcnZ0'

    ##urn = base64.b64encode(urn.encode())
    print(platform.system())
    if(platform.system() == 'Windows'):
      urn = base64.urlsafe_b64encode(bytes(urn, "utf-8"))
    else:
      urn = base64.urlsafe_b64encode(bytes(urn))
    print ('encode > urn:', urn)
    urn = urn.decode("utf-8")
    #urn = urn.rstrip("=")
    print ('decoded > urn:', urn)

    # Step 6: Submit a job to the derivative model API
    # SVF - Serial Vecto rformat

    url = BASE_URL + 'modelderivative/v2/designdata/job'

    data = {
        "input": { 'urn' : urn,
                 'compressedUrn' : False,
                 'rootFilename' : rvt_filename}, 
        "output": {
                     "formats": [
                       {
                         "type": "svf",
                         "views": [
                           "2d",
                           "3d"
                         ]
                       }
                     ]
                  }
    }


    headers = {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + access_token
    }

    print('\x1b[6;30;42m' + 'STEP 5' + '\x1b[0m')
    print ('Step 5: translate data')

    print (url)
    print (json.dumps(data))
    print (headers)

    r = requests.post(url, data=json.dumps(data), headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    print (r.content)

    print ("translate data returned status code %s." % r.status_code)

    # Step 7: Check translation completeness?
    #url = BASE_URL + 'modelderivative/v2/designdata/' + urn + '/manifest'
    url = BASE_URL + 'modelderivative/v2/designdata/' + urn + '/manifest'

    headers = {
        'Authorization' : 'Bearer ' + access_token,
        'Content-Type' : 'application/json',
    }

    print('\x1b[6;30;42m' + 'STEP 6' + '\x1b[0m')
    print ('Step 6: translate data')

    print (url)
    print (headers)

    r = requests.get(url, headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    print (r.content)
    # accept from env
    with open('output/rac1_project.json', 'w') as outfile:
        json.dump(r.json(), outfile, sort_keys = True, indent = 4, ensure_ascii = False)

    print ("check complete translate data returned status code %s." % r.status_code)

    statusMessage = ''
    while "100%" not in statusMessage:
        print("Checking translation process....")
        statusMessage = checkJobCompete(access_token, urn, url)

    # job submitted to autodesk forge API completed.
    # Step 8: Retrieve a List of Model View (Metadata) IDs
    url = BASE_URL + 'modelderivative/v2/designdata/' + urn + '/metadata'

    headers = {
        'Authorization' : 'Bearer ' + access_token,
        'Content-Type' : 'application/json',
    }

    print('\x1b[6;30;42m' + 'STEP 7' + '\x1b[0m')
    print ('Step 7: retrieve guids...')

    print (url)
    print (headers)

    r = requests.get(url, headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    ## print (r.content)

    # Step 9: Retrieve a List of Model View (Metadata) IDs
    content = eval(r.content)
    # accept from env
    with open('output/rac1_guids.json', 'w') as outfile:
        json.dump(r.json(), outfile, sort_keys = True, indent = 4, ensure_ascii = False)

    guid = content['data']['metadata'][0]['guid']
    print (guid)
    url = BASE_URL + 'modelderivative/v2/designdata/' + urn + '/metadata/' + guid + '/properties'

    headers = {
        'Authorization' : 'Bearer ' + access_token,
        'Content-Type' : 'application/json',
    }

    print('\x1b[6;30;42m' + 'STEP 8' + '\x1b[0m')
    print ('Step 8: retrieve a list of model view metadata IDs and properties...')

    print (url)
    print (headers)

    r = requests.get(url, headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    #print (r.content)
    # accept from env
    with open('output/rac1_props.json', 'w') as outfile:
        json.dump(r.json(), outfile, sort_keys = True, indent = 4, ensure_ascii = False)

def checkJobCompete(access_token, urn, url):
    # Step 7: Check translation completeness?
    print ('Step 7: Check status')
    #url = BASE_URL + 'modelderivative/v2/designdata/' + urn + '/manifest'

    headers = {
        'Authorization' : 'Bearer ' + access_token,
        'Content-Type' : 'application/json',
    }

    print (url)
    print (headers)

    r = requests.get(url, headers=headers)

    print (r.status_code)
    print (r.headers['content-type'])
    print (r.content)

    print ("check complete translate data returned status code %s." % r.status_code)
    content = eval(r.content)
    if content['status'] == 'failed':
        return "100%"

    if content['status'] == 'success' and content['progress'] == 'complete':
        return "100%"

    return ""

#main check
if __name__ == '__main__':
  # python "Project 2 step 1_forge-api.py" "sample3" "rvt-models/rac1.rvt"
  print("Project name: ", sys.argv[1])
  print("Revit Model file: ", sys.argv[2])
  print("Number of arguments: ", len(sys.argv))
  print("The arguments are: " , str(sys.argv))
  BUCKET_KEY = "forge_" + sys.argv[1]
  print(BUCKET_KEY)
  splitFilename = re.split('/',sys.argv[2])
  print(splitFilename)
  # authenticate with autodesk forge API
  access_token = authenticate()
  # create Autodesk Forge bucket
  createBucket(access_token)
  # upload the revit model to autodesk
  print(splitFilename[1])
  withoutDot2 = re.split('.rvt',splitFilename[1])
  print(withoutDot2[0])
  uploadModel(access_token, sys.argv[2], withoutDot2[0])